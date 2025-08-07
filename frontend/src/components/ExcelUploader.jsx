import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  FilePresent,
  Sync,
  Info
} from '@mui/icons-material';
import { uploadExcelFile, triggerSync } from '../api/syncApi';

export default function ExcelUploader({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);
    setSyncResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadExcelFile(formData);
      setUploadResult(result);
      
      // Déclencher automatiquement la synchronisation
      await handleSync();
      
    } catch (err) {
      console.error('❌ Erreur upload:', err);
      setError(err.message || 'Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);

    try {
      const result = await triggerSync();
      setSyncResult(result);
      
      if (result.success && onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('❌ Erreur sync:', err);
      setError(err.message || 'Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const resetUpload = () => {
    setUploadResult(null);
    setSyncResult(null);
    setError(null);
    document.getElementById('file-input').value = '';
  };

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          border: '2px dashed #e0e0e0',
          borderRadius: 3,
          textAlign: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50'
          }
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Synchroniser depuis Excel/Google Sheets
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Téléchargez le fichier Excel depuis Google Drive et uploadez-le ici
            </Typography>
            
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={() => setDialogOpen(true)}
              startIcon={<Info />}
              sx={{ mb: 2 }}
            >
              Comment procéder ?
            </Button>
          </Box>

          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUpload />}
            onClick={() => document.getElementById('file-input').click()}
            disabled={uploading || syncing}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4
            }}
          >
            {uploading ? 'Upload en cours...' : 'Sélectionner un fichier Excel'}
          </Button>

          {(uploading || syncing) && (
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {uploading ? 'Upload du fichier...' : 'Synchronisation en cours...'}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
              {error}
            </Alert>
          )}

          {uploadResult && (
            <Alert 
              severity="success" 
              sx={{ width: '100%', maxWidth: 600 }}
              icon={<FilePresent />}
            >
              <Typography variant="body2">
                Fichier uploadé avec succès : {uploadResult.filename}
              </Typography>
            </Alert>
          )}

          {syncResult && (
            <Alert 
              severity={syncResult.success ? "success" : "error"}
              sx={{ width: '100%', maxWidth: 600 }}
              icon={syncResult.success ? <CheckCircle /> : <Error />}
            >
              <Typography variant="body2">
                {syncResult.success 
                  ? `✅ ${syncResult.message || 'Synchronisation réussie'}`
                  : `❌ ${syncResult.error || 'Erreur de synchronisation'}`
                }
              </Typography>
              {syncResult.success && syncResult.count && (
                <Typography variant="caption" display="block">
                  {syncResult.count} livraisons synchronisées
                </Typography>
              )}
            </Alert>
          )}

          {(uploadResult || syncResult) && (
            <Button
              variant="outlined"
              onClick={resetUpload}
              sx={{ borderRadius: 2 }}
            >
              Nouveau fichier
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Dialog d'instructions */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            📋 Comment synchroniser vos données
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Puisque vous n'avez pas les droits de modification sur le Google Drive, 
            voici comment procéder pour synchroniser les données :
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Chip label="1" color="primary" size="small" />
              </ListItemIcon>
              <ListItemText
                primary="Télécharger le fichier Excel"
                secondary="Ouvrez Google Sheets et téléchargez le fichier Liva 2025 au format Excel (.xlsx)"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Chip label="2" color="primary" size="small" />
              </ListItemIcon>
              <ListItemText
                primary="Uploader le fichier"
                secondary="Utilisez le bouton ci-dessus pour sélectionner et uploader le fichier téléchargé"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Chip label="3" color="primary" size="small" />
              </ListItemIcon>
              <ListItemText
                primary="Synchronisation automatique"
                secondary="Le système analysera automatiquement les feuilles JUIN et JUILLET et synchronisera les données"
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 <strong>Astuce :</strong> Répétez cette opération chaque fois que le fichier Google Sheets est modifié 
              pour maintenir vos données à jour.
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Compris !
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}