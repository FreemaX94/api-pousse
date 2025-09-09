const https = require('https');
const http = require('http');

async function testImageUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log(`Content-Length: ${res.headers['content-length']}`);
      console.log(`Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          dataPreview: data.substring(0, 200)
        });
      });
    });
    
    req.on('error', (error) => {
      console.error('Erreur lors du test de l\'URL:', error);
      resolve({ error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.error('Timeout lors du test de l\'URL');
      req.abort();
      resolve({ error: 'Timeout' });
    });
  });
}

async function main() {
  const zakaImageUrl = 'https://api-pousse-uploads.ams3.digitaloceanspaces.com/movements/movement_IMG_1982_1757441186674.PNG';
  
  console.log('🔍 Test de l\'URL de l\'image "zaka":');
  console.log(`URL: ${zakaImageUrl}`);
  console.log('\n📡 Envoi de la requête...');
  
  const result = await testImageUrl(zakaImageUrl);
  
  console.log('\n📊 Résultats:');
  if (result.error) {
    console.log(`❌ Erreur: ${result.error}`);
  } else {
    console.log(`Status: ${result.statusCode}`);
    console.log(`Content-Type: ${result.headers['content-type']}`);
    console.log(`Content-Length: ${result.headers['content-length']}`);
    
    if (result.statusCode === 200) {
      console.log('✅ Image accessible - OK');
    } else if (result.statusCode === 404) {
      console.log('❌ Image non trouvée (404)');
    } else if (result.statusCode === 403) {
      console.log('❌ Accès refusé (403) - Problème de permissions');
    } else {
      console.log(`⚠️  Status inattendu: ${result.statusCode}`);
    }
    
    // Afficher un aperçu de la réponse si c'est du texte/XML
    if (result.headers['content-type'] && result.headers['content-type'].includes('text')) {
      console.log('\n📄 Aperçu de la réponse:');
      console.log(result.dataPreview);
    }
  }
}

main();