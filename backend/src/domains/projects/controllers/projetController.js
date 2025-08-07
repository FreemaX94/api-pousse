const Projet = require('../models/Projet');

const getAllProjets = async (req, res, next) => {
  try {
    const projets = await Projet.find().sort({ dateDebut: 1 });
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
    // Multer place les fichiers dans req.files
    const files = Array.isArray(req.files)
      ? req.files.map(f => f.filename)
      : [];

    // Traiter les plantes/materials si elles sont présentes
    let plants = [];
    // Le frontend envoie "materials", pas "plants"
    if (req.body.materials || req.body.plants) {
      const materialsData = req.body.materials || req.body.plants;
      console.log('🌱 Materials reçus:', materialsData);
      try {
        plants = typeof materialsData === 'string' 
          ? JSON.parse(materialsData) 
          : materialsData;
        console.log('🌱 Materials parsés:', plants);
      } catch (error) {
        console.error('Erreur lors du parsing des materials:', error);
      }
    } else {
      console.log('⚠️ Aucun materials/plants dans la requête');
    }

    // Mapper les données vers le format attendu par le modèle
    const projectData = {
      title: req.body.description || req.body.client || 'Nouveau projet',
      client: {
        type: 'individual',
        name: req.body.client || 'Client',
        contact: {
          address: {
            street: req.body.address || '',
            city: '',
            postalCode: '',
            country: 'France'
          }
        }
      },
      type: 'Installation', // Valeur par défaut requise (avec majuscule)
      dates: {
        start: req.body.dateDebut || new Date(),
        end: req.body.dateFin || new Date()
      },
      location: {
        address: req.body.address || req.body.client || 'Adresse du projet'
      },
      description: req.body.description || '',
      status: req.body.statut === 'En cours' ? 'active' : 
              req.body.statut === 'Terminé' ? 'completed' : 
              req.body.statut === 'Archivé' ? 'archived' : 'planning',
      files,
      materials: plants.length > 0 ? plants.map(plant => {
        const price = plant.unitPrice || plant.Price || plant.price || 0;
        const qty = plant.quantity || 1;
        console.log('🔍 Mapping plant to material:', {
          name: plant.name,
          reference: plant.reference,
          ItemCode: plant.ItemCode,
          fullPlant: plant
        });
        return {
          name: plant.name || plant.Name || 'Article',
          reference: plant.reference || plant.ItemCode || plant.itemCode || '',
          quantity: qty,
          unitPrice: price,
          totalPrice: price * qty,
          category: plant.category || plant.Category || 'plants',
          supplier: plant.supplier || 'Stock interne',
          status: plant.status || 'needed',
          image: plant.image || plant.imageUrl || '',
          notes: plant.notes || '',
          specifications: {
            height: plant.height || plant.Height || 0,
            diameter: plant.diameter || plant.Diameter || 0,
            potSize: plant.potSize || plant.PotSize || '',
            color: plant.color || plant.Color || ''
          }
        };
      }) : []
    };

    console.log('📝 Création projet avec données:', JSON.stringify(projectData, null, 2));
    
    const newProjet = await Projet.create(projectData);
    res.status(201).json(newProjet);
  } catch (err) {
    console.error('❌ Erreur création projet:', err);
    next(err);
  }
};

const updateProjet = async (req, res, next) => {
  try {
    const files = Array.isArray(req.files)
      ? req.files.map(f => f.filename)
      : undefined;

    // Traiter les plantes/materials si elles sont présentes
    let plants = [];
    // Le frontend envoie "materials", pas "plants"
    if (req.body.materials || req.body.plants) {
      const materialsData = req.body.materials || req.body.plants;
      console.log('🌱 Materials reçus:', materialsData);
      try {
        plants = typeof materialsData === 'string' 
          ? JSON.parse(materialsData) 
          : materialsData;
        console.log('🌱 Materials parsés:', plants);
      } catch (error) {
        console.error('Erreur lors du parsing des materials:', error);
      }
    } else {
      console.log('⚠️ Aucun materials/plants dans la requête');
    }

    const updateData = {
      ...req.body,
      ...(files ? { files } : {}),
      ...(plants.length > 0 ? { 
        'materials.nieuwkoopItems': plants.map(plant => ({
          itemCode: plant.ItemCode,
          name: plant.Name,
          quantity: plant.quantity || 1,
          unitPrice: plant.Price || 0,
          totalPrice: (plant.Price || 0) * (plant.quantity || 1),
          category: plant.Category || 'autre',
          specifications: {
            height: plant.Height || 0,
            diameter: plant.Diameter || 0
          }
        }))
      } : {})
    };

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