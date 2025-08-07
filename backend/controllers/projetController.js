const Projet = require('../models/Projet');

const getAllProjets = async (req, res, next) => {
  try {
    const projets = await Projet.find().sort({ 'dates.start': 1 });
    res.json(projets);
  } catch (err) {
    next(err);
  }
};

const getProjetById = async (req, res, next) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(projet);
  } catch (err) {
    next(err);
  }
};

const createProjet = async (req, res, next) => {
  try {
    console.log('📦 Creating project with body:', JSON.stringify(req.body, null, 2));
    console.log('📋 Body type:', typeof req.body);
    console.log('📋 Materials field:', req.body.materials);
    console.log('📋 Materials type:', typeof req.body.materials);
    
    // Multer place les fichiers dans req.files
    const files = Array.isArray(req.files)
      ? req.files.map(f => f.filename)
      : [];

    // Parse materials if they exist
    let materials = [];
    if (req.body.materials !== undefined && req.body.materials !== null) {
      console.log('🔍 Processing materials:', req.body.materials);
      try {
        if (typeof req.body.materials === 'string') {
          console.log('📝 Parsing materials from string');
          materials = JSON.parse(req.body.materials);
        } else if (Array.isArray(req.body.materials)) {
          console.log('📝 Materials already an array');
          materials = req.body.materials;
        } else {
          console.log('⚠️ Materials is neither string nor array:', typeof req.body.materials);
          materials = [];
        }
        console.log('🌱 Parsed materials:', JSON.stringify(materials, null, 2));
      } catch (e) {
        console.error('❌ Error parsing materials:', e);
        materials = [];
      }
    } else {
      console.log('⚠️ No materials field in request body');
    }

    const projectData = {
      title: req.body.client || 'Nouveau projet', // Le titre est requis dans le modèle
      client: {
        name: req.body.client || 'Client non spécifié'
      },
      description: req.body.description,
      dates: {
        start: new Date(req.body.dateDebut),
        end: new Date(req.body.dateFin)
      },
      status: req.body.statut === 'En cours' ? 'active' : 
              req.body.statut === 'Terminé' ? 'completed' : 
              req.body.statut === 'Archivé' ? 'archived' : 'draft',
      type: 'Création', // Type requis dans le modèle
      location: {
        address: req.body.address || 'Adresse non spécifiée' // Champ requis dans le modèle
      },
      documents: files.map(filename => ({
        name: filename,
        path: `/uploads/${filename}`,
        type: 'other'
      })),
      materials: materials.map(material => ({
        name: material.name,
        quantity: Number(material.quantity) || 1,
        unitPrice: Number(material.unitPrice) || 0,
        supplier: material.supplier || 'Stock interne',
        status: material.status || 'needed',
        notes: material.notes || '',
        reference: material.reference || '',
        image: material.image || ''
      }))
    };
    
    console.log('📝 Creating project with data:', {
      title: projectData.title,
      materials_count: projectData.materials.length,
      materials: projectData.materials
    });
    
    const newProjet = await Projet.create(projectData);
    
    console.log('✅ Project created with materials:', newProjet.materials?.length || 0);
    res.status(201).json(newProjet);
  } catch (err) {
    console.error('❌ Error creating project:', err);
    next(err);
  }
};

const updateProjet = async (req, res, next) => {
  try {
    const files = Array.isArray(req.files)
      ? req.files.map(f => f.filename)
      : undefined;

    // Parse materials if they exist
    let materials;
    if (req.body.materials) {
      try {
        materials = typeof req.body.materials === 'string' 
          ? JSON.parse(req.body.materials) 
          : req.body.materials;
      } catch (e) {
        materials = undefined;
      }
    }

    const updateData = {};
    
    // Mapper les champs selon la structure du modèle
    if (req.body.client) {
      updateData.title = req.body.client;
      updateData.client = { name: req.body.client };
    }
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.dateDebut && req.body.dateFin) {
      updateData.dates = {
        start: new Date(req.body.dateDebut),
        end: new Date(req.body.dateFin)
      };
    }
    if (req.body.statut) {
      updateData.status = req.body.statut === 'En cours' ? 'active' : 
                         req.body.statut === 'Terminé' ? 'completed' : 
                         req.body.statut === 'Archivé' ? 'archived' : 'draft';
    }
    if (req.body.address) {
      updateData.location = { address: req.body.address };
    }
    if (files) {
      updateData.documents = files.map(filename => ({
        name: filename,
        path: `/uploads/${filename}`,
        type: 'other'
      }));
    }
    if (materials) {
      updateData.materials = materials.map(material => ({
        name: material.name,
        quantity: material.quantity,
        unitPrice: material.unitPrice,
        supplier: material.supplier || 'Stock interne',
        status: material.status || 'needed',
        notes: material.notes || '',
        reference: material.reference || '',
        image: material.image || ''
      }));
    }

    const updated = await Projet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteProjet = async (req, res, next) => {
  try {
    const deleted = await Projet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Projet non trouvé' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProjets,
  getProjetById,
  createProjet,
  updateProjet,
  deleteProjet
};