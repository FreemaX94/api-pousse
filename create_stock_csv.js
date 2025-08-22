const fs = require('fs');

// Lire le fichier JSON de sauvegarde
const data = JSON.parse(fs.readFileSync('stock_backup_20250821_233953.json', 'utf8'));

const now = new Date();

// En-têtes CSV
let csv = `Reference;Nom;Categorie;Stock_Quantite;Prix_Unitaire;Valeur_Totale;Hauteur_cm;Diametre_cm;Statut;Date_Creation;Image_Disponible;Quantite_Reservee;Seuil_Alerte
`;

// Trier par référence
const sortedData = data.sort((a, b) => a.reference.localeCompare(b.reference));

sortedData.forEach(item => {
  const status = item.stock.quantity === 0 ? 'RUPTURE' : 
                item.stock.quantity <= (item.stock.minimumAlert || 0) ? 'ALERTE' : 
                'OK';
  
  const value = (item.stock.quantity * item.price).toFixed(2);
  const createdDate = new Date(item.createdAt).toLocaleDateString('fr-FR');
  
  // Échapper les guillemets dans le nom
  const safeName = item.name.replace(/"/g, '""');
  
  csv += `${item.reference};"${safeName}";${item.category};${item.stock.quantity};${item.price};${value};${item.dimensions?.height || 0};${item.dimensions?.diameter || 0};${status};${createdDate};${item.image ? 'OUI' : 'NON'};${item.stock.reservedQuantity || 0};${item.stock.minimumAlert || 0}
`;
});

// Créer le nom de fichier avec timestamp
const filename = `SAUVEGARDE_STOCK_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.csv`;

fs.writeFileSync(filename, csv);
console.log(`✅ Fichier CSV créé: ${filename}`);