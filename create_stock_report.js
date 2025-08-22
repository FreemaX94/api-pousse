const fs = require('fs');

// Lire le fichier JSON de sauvegarde
const data = JSON.parse(fs.readFileSync('stock_backup_20250821_233953.json', 'utf8'));

const now = new Date();
const timestamp = now.toLocaleString('fr-FR', { 
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

let report = `📦 SAUVEGARDE STOCK NIEUWKOOP - ${timestamp}
================================================================
Nombre total d'articles: ${data.length}
================================================================

RÉSUMÉ STATISTIQUES:
- Articles en stock: ${data.filter(item => item.stock.quantity > 0).length}
- Articles en rupture: ${data.filter(item => item.stock.quantity === 0).length}
- Stock total (toutes unités): ${data.reduce((sum, item) => sum + item.stock.quantity, 0)} unités
- Valeur totale estimée: ${data.reduce((sum, item) => sum + (item.stock.quantity * item.price), 0).toFixed(2)}€

================================================================
DÉTAIL PAR ARTICLE (Trié par quantité décroissante):
================================================================

`;

// Trier par quantité décroissante
const sortedData = data.sort((a, b) => b.stock.quantity - a.stock.quantity);

sortedData.forEach((item, index) => {
  const status = item.stock.quantity === 0 ? '❌ RUPTURE' : 
                item.stock.quantity <= (item.stock.minimumAlert || 0) ? '⚠️ ALERTE' : 
                '✅ OK';
  
  const value = (item.stock.quantity * item.price).toFixed(2);
  
  report += `${(index + 1).toString().padStart(3, ' ')}. [${item.reference}] ${item.name}
     📊 Stock: ${item.stock.quantity} unités | Prix: ${item.price}€ | Valeur: ${value}€
     📏 Dimensions: ${item.dimensions ? 
       `H:${item.dimensions.height || 0}cm × Ø:${item.dimensions.diameter || 0}cm` : 
       'Non spécifiées'}
     🏷️ Catégorie: ${item.category} | Statut: ${status}
     📅 Créé: ${new Date(item.createdAt).toLocaleDateString('fr-FR')}
     🖼️ Image: ${item.image ? 'Disponible' : 'Indisponible'}
     ----------------------------------------------------------------
`;
});

report += `
================================================================
ARTICLES PAR CATÉGORIE:
================================================================
`;

// Statistiques par catégorie
const categories = {};
data.forEach(item => {
  if (!categories[item.category]) {
    categories[item.category] = { count: 0, totalStock: 0, totalValue: 0 };
  }
  categories[item.category].count++;
  categories[item.category].totalStock += item.stock.quantity;
  categories[item.category].totalValue += item.stock.quantity * item.price;
});

Object.entries(categories).forEach(([category, stats]) => {
  report += `🏷️ ${category.toUpperCase()}:
   - Articles: ${stats.count}
   - Stock total: ${stats.totalStock} unités
   - Valeur: ${stats.totalValue.toFixed(2)}€
   
`;
});

report += `================================================================
ALERTES ET RUPTURES:
================================================================

ARTICLES EN RUPTURE (0 unités):
`;

const outOfStock = data.filter(item => item.stock.quantity === 0);
outOfStock.forEach((item, index) => {
  report += `${index + 1}. [${item.reference}] ${item.name} - Prix: ${item.price}€
`;
});

report += `
ARTICLES EN ALERTE (stock faible):
`;

const lowStock = data.filter(item => 
  item.stock.quantity > 0 && 
  item.stock.quantity <= (item.stock.minimumAlert || 0)
);
lowStock.forEach((item, index) => {
  report += `${index + 1}. [${item.reference}] ${item.name} - Stock: ${item.stock.quantity} unités
`;
});

report += `
================================================================
FIN DE LA SAUVEGARDE - ${timestamp}
================================================================
`;

// Créer le nom de fichier avec timestamp
const filename = `SAUVEGARDE_STOCK_COMPLETE_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.txt`;

fs.writeFileSync(filename, report);
console.log(`✅ Sauvegarde complète créée: ${filename}`);
console.log(`📊 Résumé: ${data.length} articles, ${data.reduce((sum, item) => sum + item.stock.quantity, 0)} unités, ${data.reduce((sum, item) => sum + (item.stock.quantity * item.price), 0).toFixed(2)}€`);