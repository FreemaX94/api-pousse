const axios = require('axios');

async function debugReservations() {
  try {
    console.log('🔍 DIAGNOSTIC DES RÉSERVATIONS MITSUI');
    console.log('=====================================');
    
    // Récupérer les projets
    const projectsResponse = await axios.get('http://localhost:3001/api/projets');
    const projects = projectsResponse.data;
    
    console.log(`📦 Nombre de projets trouvés: ${projects.length}`);
    
    // Trouver le projet mitsui
    const mitsuiProject = projects.find(p => 
      p.client?.name === 'mitsui' || 
      p.title?.toLowerCase().includes('mitsui') ||
      p.description?.toLowerCase().includes('mitsui')
    );
    
    if (!mitsuiProject) {
      console.log('❌ Projet mitsui non trouvé');
      console.log('Projets disponibles:');
      projects.forEach(p => {
        console.log(`  - ${p.client?.name || p.title} (${p._id})`);
      });
      return;
    }
    
    console.log('✅ Projet mitsui trouvé:');
    console.log(`  ID: ${mitsuiProject._id}`);
    console.log(`  Client: ${mitsuiProject.client?.name}`);
    console.log(`  Titre: ${mitsuiProject.title}`);
    console.log(`  Statut: ${mitsuiProject.status}`);
    console.log(`  Dates: ${mitsuiProject.dates?.start} → ${mitsuiProject.dates?.end}`);
    console.log(`  Matériaux: ${mitsuiProject.materials?.length || 0}`);
    
    if (mitsuiProject.materials) {
      console.log('\n🌱 MATÉRIAUX DU PROJET:');
      mitsuiProject.materials.forEach((material, index) => {
        console.log(`  ${index + 1}. [${material.reference}] ${material.name}`);
        console.log(`     Quantité: ${material.quantity}`);
        console.log(`     Prix unitaire: ${material.unitPrice}€`);
        console.log('     ---');
      });
    }
    
    // Simuler le calcul de réservation pour le 25 août 2025
    const targetDate = new Date('2025-08-25');
    console.log(`\n📅 SIMULATION POUR LE ${targetDate.toLocaleDateString('fr-FR')}`);
    console.log('====================================================');
    
    const stockAdjustments = {};
    
    // Vérifier si le projet est actif à cette date
    const startDate = new Date(mitsuiProject.dates?.start || mitsuiProject.dateDebut);
    const endDate = new Date(mitsuiProject.dates?.end || mitsuiProject.dateFin);
    
    console.log(`📍 Vérification période projet:`);
    console.log(`  Début: ${startDate.toLocaleDateString('fr-FR')}`);
    console.log(`  Fin: ${endDate.toLocaleDateString('fr-FR')}`);
    console.log(`  Date cible: ${targetDate.toLocaleDateString('fr-FR')}`);
    console.log(`  Projet actif? ${startDate <= targetDate && targetDate <= endDate && mitsuiProject.status !== 'completed' && mitsuiProject.status !== 'cancelled'}`);
    
    if (startDate <= targetDate && targetDate <= endDate && mitsuiProject.status !== 'completed' && mitsuiProject.status !== 'cancelled') {
      console.log('✅ Projet actif à cette date');
      
      if (mitsuiProject.materials && mitsuiProject.materials.length > 0) {
        console.log('\n🔢 CALCUL DES RÉSERVATIONS:');
        mitsuiProject.materials.forEach(material => {
          const ref = material.reference || material.ItemCode || '';
          if (ref) {
            if (!stockAdjustments[ref]) {
              stockAdjustments[ref] = 0;
            }
            console.log(`  [${ref}] ${material.name}:`);
            console.log(`    Avant: ${stockAdjustments[ref]}`);
            stockAdjustments[ref] -= (material.quantity || 0);
            console.log(`    Quantité soustraite: -${material.quantity}`);
            console.log(`    Après: ${stockAdjustments[ref]}`);
            console.log('    ---');
          }
        });
      }
    } else {
      console.log('❌ Projet NON actif à cette date');
    }
    
    console.log('\n📊 RÉSUMÉ FINAL:');
    console.log('================');
    Object.entries(stockAdjustments).forEach(([ref, adjustment]) => {
      console.log(`  ${ref}: ${adjustment} (affiché comme: ${Math.abs(adjustment)} réservés)`);
    });
    
    console.log('\n🎯 ATTENDU vs ACTUEL:');
    console.log('6ARTBOG29: attendu -3, calculé:', stockAdjustments['6ARTBOG29'] || 0);
    console.log('6ARTBOZ29: attendu -2, calculé:', stockAdjustments['6ARTBOZ29'] || 0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

debugReservations();