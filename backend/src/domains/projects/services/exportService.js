const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const Projet = require('../models/Projet');

class ExportService {
  constructor() {
    this.exportsDir = path.join(__dirname, '../../../../uploads/exports');
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(this.exportsDir)) {
      fs.mkdirSync(this.exportsDir, { recursive: true });
    }
  }

  /**
   * Export PDF d'un planning de projet
   */
  async exportProjectToPDF(projectId, options = {}) {
    try {
      const project = await Projet.findById(projectId)
        .populate('team.projectManager', 'username email')
        .populate('team.members.user', 'username email');

      if (!project) {
        throw new Error('Projet non trouvé');
      }

      const filename = `projet-${project.projectId}-${Date.now()}.pdf`;
      const filepath = path.join(this.exportsDir, filename);

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Configuration des couleurs
        const colors = {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b'
        };

        // En-tête du document
        this.addPDFHeader(doc, project, colors);

        // Informations générales
        this.addProjectInfo(doc, project, colors);

        // Timeline et jalons
        if (options.includeTimeline !== false) {
          this.addProjectTimeline(doc, project, colors);
        }

        // Équipe
        if (options.includeTeam !== false) {
          this.addTeamInfo(doc, project, colors);
        }

        // Tâches
        if (options.includeTasks !== false) {
          this.addTasksList(doc, project, colors);
        }

        // Budget
        if (options.includeBudget !== false) {
          this.addBudgetInfo(doc, project, colors);
        }

        // Matériaux
        if (options.includeMaterials !== false) {
          this.addMaterialsList(doc, project, colors);
        }

        // Pied de page
        this.addPDFFooter(doc, colors);

        doc.end();

        stream.on('finish', () => {
          resolve({
            filename,
            filepath,
            size: fs.statSync(filepath).size
          });
        });

        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Error exporting project to PDF:', error);
      throw error;
    }
  }

  /**
   * Export Excel d'un planning multi-projets
   */
  async exportPlanningToExcel(filters = {}, options = {}) {
    try {
      // Construction de la requête
      const query = this.buildProjectQuery(filters);

      const projects = await Projet.find(query)
        .populate('team.projectManager', 'username email')
        .populate('team.members.user', 'username email')
        .sort({ 'dates.start': 1 });

      const filename = `planning-${Date.now()}.xlsx`;
      const filepath = path.join(this.exportsDir, filename);

      const workbook = new ExcelJS.Workbook();

      // Métadonnées
      workbook.creator = 'API Pousse - Système de gestion';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Feuille principale : Vue d'ensemble
      await this.createOverviewSheet(workbook, projects);

      // Feuille détaillée : Projets
      if (options.includeProjects !== false) {
        await this.createProjectsSheet(workbook, projects);
      }

      // Feuille : Tâches
      if (options.includeTasks !== false) {
        await this.createTasksSheet(workbook, projects);
      }

      // Feuille : Ressources
      if (options.includeResources !== false) {
        await this.createResourcesSheet(workbook, projects);
      }

      // Feuille : Timeline
      if (options.includeTimeline !== false) {
        await this.createTimelineSheet(workbook, projects);
      }

      // Feuille : Statistiques
      if (options.includeStats !== false) {
        await this.createStatsSheet(workbook, projects);
      }

      await workbook.xlsx.writeFile(filepath);

      return {
        filename,
        filepath,
        size: fs.statSync(filepath).size,
        projectCount: projects.length
      };
    } catch (error) {
      console.error('Error exporting planning to Excel:', error);
      throw error;
    }
  }

  /**
   * Export PDF d'un calendrier mensuel
   */
  async exportCalendarToPDF(year, month, options = {}) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const projects = await Projet.find({
        $or: [
          {
            'dates.start': { $lte: endDate },
            'dates.end': { $gte: startDate }
          }
        ],
        status: { $nin: ['cancelled', 'archived'] }
      }).populate('team.projectManager', 'username');

      const filename = `calendrier-${year}-${month.toString().padStart(2, '0')}-${Date.now()}.pdf`;
      const filepath = path.join(this.exportsDir, filename);

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          layout: 'landscape',
          margin: 30
        });
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Titre du calendrier
        doc.fontSize(24)
           .fillColor('#1f2937')
           .text(`Calendrier ${this.getMonthName(month)} ${year}`, 50, 50);

        // Créer la grille du calendrier
        this.createCalendarGrid(doc, year, month, projects);

        // Légende
        this.addCalendarLegend(doc, projects);

        doc.end();

        stream.on('finish', () => {
          resolve({
            filename,
            filepath,
            size: fs.statSync(filepath).size
          });
        });

        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Error exporting calendar to PDF:', error);
      throw error;
    }
  }

  // Méthodes helpers pour PDF

  addPDFHeader(doc, project, colors) {
    // Logo et titre
    doc.fontSize(20)
       .fillColor(colors.primary)
       .text('🌿 API Pousse', 50, 50);

    doc.fontSize(24)
       .fillColor('#1f2937')
       .text(project.title || 'Projet sans titre', 50, 90);

    doc.fontSize(12)
       .fillColor(colors.secondary)
       .text(`ID: ${project.projectId}`, 50, 120)
       .text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 400, 120);

    // Ligne de séparation
    doc.moveTo(50, 140)
       .lineTo(550, 140)
       .strokeColor(colors.primary)
       .stroke();
  }

  addProjectInfo(doc, project, colors) {
    let y = 160;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Informations générales', 50, y);

    y += 30;

    const info = [
      ['Client:', project.client?.name || 'Non spécifié'],
      ['Type:', project.type],
      ['Catégorie:', project.category],
      ['Statut:', this.getStatusLabel(project.status)],
      ['Priorité:', this.getPriorityLabel(project.priority)],
      ['Date début:', project.dates.start ? project.dates.start.toLocaleDateString('fr-FR') : 'Non définie'],
      ['Date fin:', project.dates.end ? project.dates.end.toLocaleDateString('fr-FR') : 'Non définie'],
      ['Durée estimée:', `${project.duration?.estimated || 0} jours`]
    ];

    info.forEach(([label, value]) => {
      doc.fontSize(11)
         .fillColor(colors.secondary)
         .text(label, 50, y)
         .fillColor('#1f2937')
         .text(value, 150, y);
      y += 18;
    });

    if (project.description) {
      y += 10;
      doc.fontSize(12)
         .fillColor(colors.secondary)
         .text('Description:', 50, y);
      y += 20;
      doc.fontSize(10)
         .fillColor('#1f2937')
         .text(project.description, 50, y, { width: 500 });
    }

    return y + 40;
  }

  addProjectTimeline(doc, project, colors) {
    if (doc.y > 700) doc.addPage();

    let y = doc.y + 20;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Timeline et Jalons', 50, y);

    y += 30;

    if (project.milestones && project.milestones.length > 0) {
      project.milestones.forEach((milestone, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        // Icône du jalon
        doc.circle(60, y + 8, 4)
           .fillColor(milestone.status === 'completed' ? colors.accent : colors.warning)
           .fill();

        // Informations du jalon
        doc.fontSize(12)
           .fillColor('#1f2937')
           .text(milestone.title, 80, y)
           .fontSize(10)
           .fillColor(colors.secondary)
           .text(milestone.dueDate ? milestone.dueDate.toLocaleDateString('fr-FR') : 'Date non définie', 80, y + 15);

        if (milestone.description) {
          doc.fontSize(9)
             .fillColor('#4b5563')
             .text(milestone.description, 80, y + 30, { width: 450 });
        }

        y += 55;
      });
    } else {
      doc.fontSize(10)
         .fillColor(colors.secondary)
         .text('Aucun jalon défini pour ce projet', 50, y);
    }
  }

  addTeamInfo(doc, project, colors) {
    if (doc.y > 650) doc.addPage();

    let y = doc.y + 30;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Équipe', 50, y);

    y += 30;

    // Chef de projet
    if (project.team?.projectManager) {
      doc.fontSize(12)
         .fillColor(colors.primary)
         .text('👨‍💼 Chef de projet:', 50, y)
         .fillColor('#1f2937')
         .text(project.team.projectManager.username || 'Non défini', 150, y);
      y += 20;
    }

    // Membres de l'équipe
    if (project.team?.members && project.team.members.length > 0) {
      doc.fontSize(12)
         .fillColor(colors.primary)
         .text('Équipe:', 50, y);
      y += 20;

      project.team.members.forEach(member => {
        doc.fontSize(10)
           .fillColor('#1f2937')
           .text(`• ${member.user?.username || 'Utilisateur'} (${member.role})`, 70, y);
        y += 15;
      });
    }
  }

  addTasksList(doc, project, colors) {
    if (!project.tasks || project.tasks.length === 0) return;

    if (doc.y > 600) doc.addPage();

    let y = doc.y + 30;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Tâches', 50, y);

    y += 30;

    project.tasks.forEach((task, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      // Statut de la tâche
      const statusColor = this.getTaskStatusColor(task.status, colors);
      doc.circle(60, y + 8, 4)
         .fillColor(statusColor)
         .fill();

      // Titre et détails
      doc.fontSize(11)
         .fillColor('#1f2937')
         .text(`${index + 1}. ${task.title}`, 80, y);

      doc.fontSize(9)
         .fillColor(colors.secondary)
         .text(`Statut: ${this.getTaskStatusLabel(task.status)} | Priorité: ${task.priority}`, 80, y + 15);

      if (task.estimatedHours) {
        doc.text(`Temps estimé: ${task.estimatedHours}h`, 300, y + 15);
      }

      if (task.description) {
        doc.fontSize(9)
           .fillColor('#4b5563')
           .text(task.description, 80, y + 30, { width: 450 });
        y += 55;
      } else {
        y += 35;
      }
    });
  }

  addBudgetInfo(doc, project, colors) {
    if (!project.budget) return;

    if (doc.y > 650) doc.addPage();

    let y = doc.y + 30;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Budget', 50, y);

    y += 30;

    const budget = project.budget;
    const budgetItems = [
      ['Matériaux:', `${budget.materials || 0} €`],
      ['Main d\'œuvre:', `${budget.labor || 0} €`],
      ['Équipement:', `${budget.equipment || 0} €`],
      ['Frais généraux:', `${budget.overhead || 0} €`]
    ];

    budgetItems.forEach(([label, value]) => {
      doc.fontSize(11)
         .fillColor(colors.secondary)
         .text(label, 50, y)
         .fillColor('#1f2937')
         .text(value, 200, y);
      y += 18;
    });

    // Total
    const total = (budget.materials || 0) + (budget.labor || 0) +
                  (budget.equipment || 0) + (budget.overhead || 0);

    doc.fontSize(12)
       .fillColor(colors.primary)
       .text('Total:', 50, y + 10)
       .text(`${total} €`, 200, y + 10);
  }

  addMaterialsList(doc, project, colors) {
    if (!project.materials || project.materials.length === 0) return;

    if (doc.y > 600) doc.addPage();

    let y = doc.y + 30;

    doc.fontSize(16)
       .fillColor('#1f2937')
       .text('Matériaux', 50, y);

    y += 30;

    // Headers
    doc.fontSize(10)
       .fillColor(colors.primary)
       .text('Matériau', 50, y)
       .text('Qté', 200, y)
       .text('Prix U.', 250, y)
       .text('Total', 320, y)
       .text('Statut', 400, y);

    y += 20;

    project.materials.forEach(material => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      const total = (material.quantity || 0) * (material.unitPrice || 0);

      doc.fontSize(9)
         .fillColor('#1f2937')
         .text(material.name, 50, y, { width: 140 })
         .text(material.quantity?.toString() || '0', 200, y)
         .text(`${material.unitPrice || 0}€`, 250, y)
         .text(`${total.toFixed(2)}€`, 320, y)
         .fillColor(this.getMaterialStatusColor(material.status, colors))
         .text(this.getMaterialStatusLabel(material.status), 400, y);

      y += 15;
    });
  }

  addPDFFooter(doc, colors) {
    const bottomY = 750;

    doc.fontSize(8)
       .fillColor(colors.secondary)
       .text('Généré par API Pousse - Système de gestion de projets paysagers', 50, bottomY)
       .text(`Page ${doc.bufferedPageRange().start + 1}`, 500, bottomY);
  }

  // Méthodes helpers pour Excel

  async createOverviewSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Vue d\'ensemble');

    // En-têtes
    worksheet.columns = [
      { header: 'ID Projet', key: 'projectId', width: 15 },
      { header: 'Titre', key: 'title', width: 30 },
      { header: 'Client', key: 'client', width: 20 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Statut', key: 'status', width: 15 },
      { header: 'Priorité', key: 'priority', width: 12 },
      { header: 'Chef de projet', key: 'projectManager', width: 20 },
      { header: 'Date début', key: 'startDate', width: 12 },
      { header: 'Date fin', key: 'endDate', width: 12 },
      { header: 'Durée (jours)', key: 'duration', width: 12 },
      { header: 'Budget total', key: 'budget', width: 15 },
      { header: 'Progression (%)', key: 'progress', width: 15 }
    ];

    // Style de l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Données
    projects.forEach(project => {
      worksheet.addRow({
        projectId: project.projectId,
        title: project.title,
        client: project.client?.name || '',
        type: project.type,
        status: this.getStatusLabel(project.status),
        priority: this.getPriorityLabel(project.priority),
        projectManager: project.team?.projectManager?.username || '',
        startDate: project.dates?.start,
        endDate: project.dates?.end,
        duration: project.duration?.estimated || 0,
        budget: project.budget?.total || 0,
        progress: project.calculateProgress()
      });
    });

    // Format des colonnes
    worksheet.getColumn('startDate').numFmt = 'dd/mm/yyyy';
    worksheet.getColumn('endDate').numFmt = 'dd/mm/yyyy';
    worksheet.getColumn('budget').numFmt = '#,##0.00 "€"';
  }

  async createProjectsSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Projets détaillés');

    // Configuration complexe pour les détails complets
    worksheet.columns = [
      { header: 'ID', key: 'projectId', width: 15 },
      { header: 'Titre', key: 'title', width: 35 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Client', key: 'clientName', width: 20 },
      { header: 'Email client', key: 'clientEmail', width: 25 },
      { header: 'Téléphone', key: 'clientPhone', width: 15 },
      { header: 'Adresse', key: 'address', width: 40 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Catégorie', key: 'category', width: 15 },
      { header: 'Statut', key: 'status', width: 15 },
      { header: 'Priorité', key: 'priority', width: 12 },
      { header: 'Chef de projet', key: 'projectManager', width: 20 },
      { header: 'Membres équipe', key: 'teamMembers', width: 30 },
      { header: 'Date création', key: 'createdAt', width: 15 },
      { header: 'Date début', key: 'startDate', width: 12 },
      { header: 'Date fin', key: 'endDate', width: 12 },
      { header: 'Budget matériaux', key: 'budgetMaterials', width: 15 },
      { header: 'Budget main œuvre', key: 'budgetLabor', width: 15 },
      { header: 'Budget équipement', key: 'budgetEquipment', width: 15 },
      { header: 'Budget total', key: 'budgetTotal', width: 15 },
      { header: 'Nb tâches', key: 'taskCount', width: 12 },
      { header: 'Tâches terminées', key: 'completedTasks', width: 15 },
      { header: 'Progression %', key: 'progress', width: 12 }
    ];

    // Style de l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10B981' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Données détaillées
    projects.forEach(project => {
      const completedTasks = project.tasks.filter(t => t.status === 'completed').length;

      worksheet.addRow({
        projectId: project.projectId,
        title: project.title,
        description: project.description,
        clientName: project.client?.name || '',
        clientEmail: project.client?.contact?.email || '',
        clientPhone: project.client?.contact?.phone || '',
        address: project.location?.address || '',
        type: project.type,
        category: project.category,
        status: this.getStatusLabel(project.status),
        priority: this.getPriorityLabel(project.priority),
        projectManager: project.team?.projectManager?.username || '',
        teamMembers: project.team?.members?.map(m => m.user?.username).join(', ') || '',
        createdAt: project.createdAt,
        startDate: project.dates?.start,
        endDate: project.dates?.end,
        budgetMaterials: project.budget?.materials || 0,
        budgetLabor: project.budget?.labor || 0,
        budgetEquipment: project.budget?.equipment || 0,
        budgetTotal: project.budget?.total || 0,
        taskCount: project.tasks.length,
        completedTasks: completedTasks,
        progress: project.calculateProgress()
      });
    });

    // Formats
    ['createdAt', 'startDate', 'endDate'].forEach(col => {
      worksheet.getColumn(col).numFmt = 'dd/mm/yyyy';
    });

    ['budgetMaterials', 'budgetLabor', 'budgetEquipment', 'budgetTotal'].forEach(col => {
      worksheet.getColumn(col).numFmt = '#,##0.00 "€"';
    });
  }

  async createTasksSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Tâches');

    worksheet.columns = [
      { header: 'ID Projet', key: 'projectId', width: 15 },
      { header: 'Projet', key: 'projectTitle', width: 30 },
      { header: 'Tâche', key: 'taskTitle', width: 35 },
      { header: 'Description', key: 'taskDescription', width: 50 },
      { header: 'Statut', key: 'status', width: 15 },
      { header: 'Priorité', key: 'priority', width: 12 },
      { header: 'Assigné à', key: 'assignedTo', width: 20 },
      { header: 'Temps estimé (h)', key: 'estimatedHours', width: 15 },
      { header: 'Temps réel (h)', key: 'actualHours', width: 15 },
      { header: 'Date échéance', key: 'dueDate', width: 12 },
      { header: 'Date achèvement', key: 'completedDate', width: 12 }
    ];

    // Style de l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF59E0B' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Extraction de toutes les tâches
    projects.forEach(project => {
      project.tasks.forEach(task => {
        worksheet.addRow({
          projectId: project.projectId,
          projectTitle: project.title,
          taskTitle: task.title,
          taskDescription: task.description,
          status: this.getTaskStatusLabel(task.status),
          priority: this.getPriorityLabel(task.priority),
          assignedTo: task.assignedTo?.username || '',
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          dueDate: task.dueDate,
          completedDate: task.completedDate
        });
      });
    });

    // Formats
    worksheet.getColumn('dueDate').numFmt = 'dd/mm/yyyy';
    worksheet.getColumn('completedDate').numFmt = 'dd/mm/yyyy';
  }

  async createResourcesSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Ressources');

    worksheet.columns = [
      { header: 'ID Projet', key: 'projectId', width: 15 },
      { header: 'Projet', key: 'projectTitle', width: 30 },
      { header: 'Type ressource', key: 'resourceType', width: 15 },
      { header: 'Nom', key: 'resourceName', width: 30 },
      { header: 'Référence', key: 'reference', width: 20 },
      { header: 'Quantité', key: 'quantity', width: 12 },
      { header: 'Prix unitaire', key: 'unitPrice', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Fournisseur', key: 'supplier', width: 25 },
      { header: 'Statut', key: 'status', width: 15 }
    ];

    // Style de l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8B5CF6' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Extraction des matériaux et équipements
    projects.forEach(project => {
      // Matériaux
      project.materials?.forEach(material => {
        worksheet.addRow({
          projectId: project.projectId,
          projectTitle: project.title,
          resourceType: 'Matériau',
          resourceName: material.name,
          reference: material.reference,
          quantity: material.quantity,
          unitPrice: material.unitPrice,
          total: (material.quantity || 0) * (material.unitPrice || 0),
          supplier: material.supplier,
          status: this.getMaterialStatusLabel(material.status)
        });
      });

      // Équipements
      project.equipment?.forEach(equipment => {
        worksheet.addRow({
          projectId: project.projectId,
          projectTitle: project.title,
          resourceType: 'Équipement',
          resourceName: equipment.name,
          reference: equipment.type,
          quantity: equipment.quantity,
          unitPrice: null,
          total: null,
          supplier: null,
          status: equipment.status
        });
      });
    });

    // Formats
    worksheet.getColumn('unitPrice').numFmt = '#,##0.00 "€"';
    worksheet.getColumn('total').numFmt = '#,##0.00 "€"';
  }

  async createTimelineSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Timeline');

    // Création d'un gantt simplifié
    worksheet.columns = [
      { header: 'Projet', key: 'project', width: 30 },
      { header: 'Tâche/Jalon', key: 'item', width: 35 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Date début', key: 'startDate', width: 12 },
      { header: 'Date fin', key: 'endDate', width: 12 },
      { header: 'Durée', key: 'duration', width: 12 },
      { header: 'Statut', key: 'status', width: 15 }
    ];

    // Ajout des dates sous forme de colonnes (30 jours à partir d'aujourd'hui)
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      worksheet.getColumn(8 + i).header = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      worksheet.getColumn(8 + i).width = 8;
    }

    // Style de l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6366F1' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Données du timeline
    projects.forEach(project => {
      // Projet principal
      const projectRow = worksheet.addRow({
        project: project.title,
        item: 'Projet complet',
        type: 'Projet',
        startDate: project.dates?.start,
        endDate: project.dates?.end,
        duration: project.duration?.estimated || 0,
        status: this.getStatusLabel(project.status)
      });

      // Colorer la ligne du projet
      this.colorTimelineRow(worksheet, projectRow, project.dates?.start, project.dates?.end, today, '#3b82f6');

      // Jalons
      project.milestones?.forEach(milestone => {
        const milestoneRow = worksheet.addRow({
          project: '',
          item: `📍 ${milestone.title}`,
          type: 'Jalon',
          startDate: milestone.dueDate,
          endDate: milestone.dueDate,
          duration: 1,
          status: this.getStatusLabel(milestone.status)
        });

        this.colorTimelineRow(worksheet, milestoneRow, milestone.dueDate, milestone.dueDate, today, '#10b981');
      });

      // Tâches principales
      project.tasks?.slice(0, 5).forEach(task => {
        const taskRow = worksheet.addRow({
          project: '',
          item: `  └ ${task.title}`,
          type: 'Tâche',
          startDate: task.dueDate,
          endDate: task.dueDate,
          duration: Math.ceil((task.estimatedHours || 8) / 8),
          status: this.getTaskStatusLabel(task.status)
        });

        const color = task.status === 'completed' ? '#10b981' : task.status === 'in_progress' ? '#f59e0b' : '#6b7280';
        this.colorTimelineRow(worksheet, taskRow, task.dueDate, task.dueDate, today, color);
      });
    });

    // Format des dates
    worksheet.getColumn('startDate').numFmt = 'dd/mm/yyyy';
    worksheet.getColumn('endDate').numFmt = 'dd/mm/yyyy';
  }

  async createStatsSheet(workbook, projects) {
    const worksheet = workbook.addWorksheet('Statistiques');

    // Statistiques générales
    const stats = this.calculateProjectStats(projects);

    // Titre
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'Statistiques des projets';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    let row = 3;

    // Stats générales
    const generalStats = [
      ['Nombre total de projets', projects.length],
      ['Projets actifs', stats.activeProjects],
      ['Projets terminés', stats.completedProjects],
      ['Projets en retard', stats.overdueProjects],
      ['Budget total', `${stats.totalBudget.toFixed(2)} €`],
      ['Budget moyen', `${stats.avgBudget.toFixed(2)} €`],
      ['Durée moyenne', `${stats.avgDuration.toFixed(1)} jours`]
    ];

    worksheet.getCell(`A${row}`).value = 'Statistiques générales';
    worksheet.getCell(`A${row}`).font = { bold: true, size: 14 };
    row += 2;

    generalStats.forEach(([label, value]) => {
      worksheet.getCell(`A${row}`).value = label;
      worksheet.getCell(`B${row}`).value = value;
      row++;
    });

    row += 2;

    // Stats par statut
    worksheet.getCell(`A${row}`).value = 'Répartition par statut';
    worksheet.getCell(`A${row}`).font = { bold: true, size: 14 };
    row += 2;

    Object.entries(stats.byStatus).forEach(([status, count]) => {
      worksheet.getCell(`A${row}`).value = this.getStatusLabel(status);
      worksheet.getCell(`B${row}`).value = count;
      row++;
    });

    row += 2;

    // Stats par type
    worksheet.getCell(`A${row}`).value = 'Répartition par type';
    worksheet.getCell(`A${row}`).font = { bold: true, size: 14 };
    row += 2;

    Object.entries(stats.byType).forEach(([type, count]) => {
      worksheet.getCell(`A${row}`).value = type;
      worksheet.getCell(`B${row}`).value = count;
      row++;
    });

    // Formatting
    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('B').width = 20;
  }

  // Méthodes utilitaires

  buildProjectQuery(filters) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.priority) query.priority = filters.priority;

    if (filters.startDate || filters.endDate) {
      query['dates.start'] = {};
      if (filters.startDate) query['dates.start'].$gte = new Date(filters.startDate);
      if (filters.endDate) query['dates.start'].$lte = new Date(filters.endDate);
    }

    if (filters.projectManager) {
      query['team.projectManager'] = filters.projectManager;
    }

    return query;
  }

  calculateProjectStats(projects) {
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => ['active', 'planned'].includes(p.status)).length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      overdueProjects: projects.filter(p => p.isOverdue).length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
      avgBudget: 0,
      avgDuration: 0,
      byStatus: {},
      byType: {},
      byCategory: {}
    };

    if (projects.length > 0) {
      stats.avgBudget = stats.totalBudget / projects.length;
      stats.avgDuration = projects.reduce((sum, p) => sum + (p.duration?.estimated || 0), 0) / projects.length;
    }

    // Répartitions
    projects.forEach(project => {
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      stats.byType[project.type] = (stats.byType[project.type] || 0) + 1;
      stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
    });

    return stats;
  }

  colorTimelineRow(worksheet, row, startDate, endDate, today, color) {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      if (checkDate >= start && checkDate <= end) {
        const cell = worksheet.getCell(row.number, 8 + i);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color.replace('#', 'FF') }
        };
        cell.value = '█';
      }
    }
  }

  // Helpers pour les labels et couleurs
  getStatusLabel(status) {
    const labels = {
      'draft': 'Brouillon',
      'planned': 'Planifié',
      'active': 'En cours',
      'on_hold': 'En pause',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'archived': 'Archivé',
      'pending': 'En attente',
      'in_progress': 'En cours',
      'review': 'En révision',
      'delayed': 'Retardé'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority) {
    const labels = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  }

  getTaskStatusLabel(status) {
    const labels = {
      'todo': 'À faire',
      'in_progress': 'En cours',
      'review': 'En révision',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  }

  getMaterialStatusLabel(status) {
    const labels = {
      'needed': 'Nécessaire',
      'ordered': 'Commandé',
      'delivered': 'Livré',
      'used': 'Utilisé',
      'returned': 'Retourné'
    };
    return labels[status] || status;
  }

  getTaskStatusColor(status, colors) {
    const statusColors = {
      'todo': colors.secondary,
      'in_progress': colors.warning,
      'review': colors.primary,
      'completed': colors.accent,
      'cancelled': colors.danger
    };
    return statusColors[status] || colors.secondary;
  }

  getMaterialStatusColor(status, colors) {
    const statusColors = {
      'needed': colors.danger,
      'ordered': colors.warning,
      'delivered': colors.primary,
      'used': colors.accent,
      'returned': colors.secondary
    };
    return statusColors[status] || colors.secondary;
  }

  getMonthName(month) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1] || '';
  }

  createCalendarGrid(doc, year, month, projects) {
    // Implémentation du calendrier PDF (complexe)
    // Cette méthode nécessiterait une implémentation détaillée
    // pour créer une grille de calendrier avec les projets

    doc.fontSize(12)
       .text('Grille du calendrier à implémenter', 50, 100);

    // TODO: Implémenter la grille visuelle du calendrier
  }

  addCalendarLegend(doc, projects) {
    // Légende du calendrier
    doc.fontSize(10)
       .text('Légende:', 50, 600);

    const legend = [
      ['🟦', 'Projets en cours'],
      ['🟩', 'Projets terminés'],
      ['🟧', 'Projets en retard'],
      ['🟨', 'Projets planifiés']
    ];

    let y = 620;
    legend.forEach(([symbol, label]) => {
      doc.text(symbol, 50, y)
         .text(label, 80, y);
      y += 15;
    });
  }

  /**
   * Nettoyer les anciens exports
   */
  cleanupOldExports(maxAge = 24 * 60 * 60 * 1000) { // 24 heures par défaut
    try {
      const files = fs.readdirSync(this.exportsDir);
      const now = Date.now();

      files.forEach(file => {
        const filePath = path.join(this.exportsDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Ancien export supprimé: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error cleaning up old exports:', error);
    }
  }
}

module.exports = new ExportService();