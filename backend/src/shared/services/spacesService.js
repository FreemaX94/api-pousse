const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configuration DigitalOcean Spaces
const spacesClient = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT || 'https://ams3.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'ams3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || ''
  },
  forcePathStyle: false // DigitalOcean Spaces utilise des sous-domaines virtuels
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || 'api-pousse-uploads';

/**
 * Upload un fichier vers DigitalOcean Spaces
 * @param {Buffer} fileBuffer - Le contenu du fichier
 * @param {string} fileName - Le nom du fichier
 * @param {string} contentType - Le type MIME du fichier
 * @param {string} folder - Le dossier dans le bucket (ex: 'movements')
 * @returns {Promise<string>} L'URL publique du fichier
 */
async function uploadFile(fileBuffer, fileName, contentType, folder = 'movements') {
  try {
    const key = folder ? `${folder}/${fileName}` : fileName;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read' // Rendre le fichier accessible publiquement
    });

    await spacesClient.send(command);
    
    // Construire l'URL publique
    const publicUrl = `https://${BUCKET_NAME}.ams3.digitaloceanspaces.com/${key}`;
    
    console.log('✅ Fichier uploadé vers Spaces:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('❌ Erreur upload Spaces:', error);
    throw error;
  }
}

/**
 * Génère une URL signée pour un accès temporaire
 * @param {string} key - La clé du fichier dans Spaces
 * @param {number} expiresIn - Durée en secondes (défaut: 1 heure)
 * @returns {Promise<string>} URL signée
 */
async function getSignedFileUrl(key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    const url = await getSignedUrl(spacesClient, command, { expiresIn });
    return url;
    
  } catch (error) {
    console.error('❌ Erreur génération URL signée:', error);
    throw error;
  }
}

/**
 * Vérifie si les credentials Spaces sont configurés
 * @returns {boolean} True si configuré
 */
function isSpacesConfigured() {
  return !!(
    process.env.DO_SPACES_KEY && 
    process.env.DO_SPACES_SECRET && 
    process.env.DO_SPACES_BUCKET
  );
}

module.exports = {
  uploadFile,
  getSignedFileUrl,
  isSpacesConfigured,
  BUCKET_NAME
};