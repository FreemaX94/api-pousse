import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Sync,
  CloudSync,
  Schedule,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Info
} from '@mui/icons-material';
import { api } from '../api/domains/inventory/clientApi';

const SyncManager = () => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Charger le statut de synchronisation
  const loadSyncStatus = async () => {
    try {
      const response = await api.get('/sync/status');
      setSyncStatus(response.data);
    } catch (err) {
      console.error('Erreur chargement statut sync:', err);
      setError('Impossible de charger le statut de synchronisation');
    }
  };

  // Déclencher une synchronisation manuelle
  const triggerSync = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/sync/trigger');
      setSuccess(`Synchronisation réussie: ${response.data.message}`);
      await loadSyncStatus();
    } catch (err) {
      console.error('Erreur sync manuelle:', err);
      setError('Erreur lors de la synchronisation manuelle');
    } finally {
      setLoading(false);
    }
  };

  // Configurer les paramètres de synchronisation
  const configureSyncSettings = async () => {
    try {
      await api.post('/sync/configure', {
        intervalMinutes,
        enabled: autoSyncEnabled
      });
      setSuccess('Configuration mise à jour avec succès');
      await loadSyncStatus();
    } catch (err) {
      console.error('Erreur configuration sync:', err);
      setError('Erreur lors de la configuration');
    }
  };

  // Charger le statut au montage et périodiquement
  useEffect(() => {
    loadSyncStatus();
    const interval = setInterval(loadSyncStatus, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (!syncStatus) return 'default';
    return syncStatus.success ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    if (!syncStatus) return <CloudSync />;
    return syncStatus.success ? <CheckCircle /> : <Error />;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <CloudSync color="primary" fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Synchronisation Google Drive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Synchronisation automatique du fichier Liva 2025
              </Typography>
            </Box>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Statut actuel */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Statut de la synchronisation
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={getStatusIcon()}
                label={syncStatus?.success ? 'Actif' : 'Erreur'}
                color={getStatusColor()}
                variant="outlined"
              />
              
              {syncStatus?.lastSyncTime && (
                <Typography variant="body2" color="text.secondary">
                  Dernière sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
                </Typography>
              )}
              
              <Tooltip title="Actualiser le statut">
                <IconButton onClick={loadSyncStatus} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Stack>

            {syncStatus?.fileModified && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Info sx={{ mr: 1 }} />
                Le fichier Google Drive a été modifié et sera synchronisé prochainement
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Actions
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Sync />}
                onClick={triggerSync}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? 'Synchronisation...' : 'Synchroniser maintenant'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadSyncStatus}
                sx={{ borderRadius: 2 }}
              >
                Actualiser le statut
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Configuration */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Configuration
            </Typography>
            
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label="Synchronisation automatique"
              />
              
              <TextField
                label="Intervalle (minutes)"
                type="number"
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
                inputProps={{ min: 5, max: 1440 }}
                helperText="Intervalle entre les synchronisations automatiques (5-1440 minutes)"
                sx={{ maxWidth: 200 }}
              />
              
              <Button
                variant="contained"
                startIcon={<Settings />}
                onClick={configureSyncSettings}
                sx={{ 
                  maxWidth: 200,
                  borderRadius: 2,
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                Appliquer la configuration
              </Button>
            </Stack>
          </Box>

          {/* Informations */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Comment ça fonctionne:</strong>
              <br />
              • Le système vérifie automatiquement les modifications du fichier Google Drive
              <br />
              • Quand une modification est détectée, les données sont synchronisées
              <br />
              • Les anciennes données sont remplacées par les nouvelles
              <br />
              • Vous pouvez déclencher une synchronisation manuelle à tout moment
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SyncManager;