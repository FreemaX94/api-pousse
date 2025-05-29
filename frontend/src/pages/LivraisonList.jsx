// src/pages/LivraisonList.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchLivraisons, syncLivraisons } from '../api/livraisonApi.js';
import '../components/Livraison.css';    // ← Chemin et casse exactement comme sur disque

const theme = createTheme({
  palette: {
    primary: { main: '#ff4d4f' },
    background: { default: '#fafafa' }
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    button: { textTransform: 'none' }
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        },
        columnHeaders: {
          backgroundColor: '#fff',
          color: '#333',
          borderBottom: '1px solid #eee'
        },
        cell: {
          whiteSpace: 'normal',
          lineHeight: 1.4,
          padding: '8px'
        }
      }
    }
  }
});

export default function LivraisonList() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [pole, setPole]       = useState('');

  useEffect(() => {
    loadData();
  }, [pole]);

  async function loadData() {
    setLoading(true);
    try {
      const resp = await fetchLivraisons(pole);
      const arr  = Array.isArray(resp) ? resp : resp.deliveries || [];
      setRows(arr.map(r => ({ id: r.id, ...r })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setLoading(true);
    try {
      await syncLivraisons(pole);
      await loadData();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const poles = Array.from(new Set(rows.map(r => r.pole).filter(Boolean)));

  const columns = [
    { field: 'horaire',        headerName: 'Horaire',        flex: 0.8, minWidth: 80 },
    { field: 'demandeur',      headerName: 'Demandeur',      flex: 1,   minWidth: 100 },
    { field: 'colis',          headerName: 'Colis',          flex: 0.6, minWidth: 60,
        valueFormatter: ({ value }) => value || 0
    },
    { field: 'refDevis',       headerName: 'Réf. devis',     flex: 1,   minWidth: 100 },
    { field: 'client',         headerName: 'Client',         flex: 1,   minWidth: 120 },
    { field: 'entreprise',     headerName: 'Entreprise',     flex: 1,   minWidth: 120 },
    { field: 'destination',    headerName: 'Destination',    flex: 2,   minWidth: 200 },
    { field: 'accesLivraison', headerName: 'Accès livraison', flex: 1.5, minWidth: 160 },
    {
      field: 'infos',
      headerName: 'Infos',
      flex: 2,
      minWidth: 250,
      renderCell: params => <div style={{ whiteSpace: 'pre-wrap' }}>{params.value}</div>
    },
    { field: 'telephone',      headerName: 'Tél.',           flex: 1,   minWidth: 100 },
    {
      field: 'clientPrevenu',
      headerName: 'Prévenu(e)',
      flex: 0.8,
      minWidth: 80,
      renderCell: params => (params.value ? '✔️' : '❌')
    },
    {
      field: 'prix',
      headerName: 'Prix',
      flex: 0.8,
      minWidth: 80,
      valueFormatter: ({ value }) => `${parseFloat(value).toFixed(2)} €`
    },
    {
      field: 'fait',
      headerName: 'Fait',
      flex: 0.8,
      minWidth: 80,
      renderCell: ({ value }) =>
        value
          ? <span style={{ color: '#52c41a', fontWeight: 600 }}>✔️</span>
          : <span style={{ color: '#faad14', fontWeight: 600 }}>À faire</span>
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="livraison-page">
        <div className="livraison-header">
          <Typography variant="h5" component="h1">
            Livraisons – MAI 2025
          </Typography>

          <div style={{ display: 'flex', gap: 16 }}>
            <Select
              value={pole}
              onChange={e => setPole(e.target.value)}
              displayEmpty
              className="livraison-select"
            >
              <MenuItem value="">Tous les pôles</MenuItem>
              {poles.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSync}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              Synchroniser
            </Button>
          </div>
        </div>

        <div style={{ height: 700, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSize={15}
            rowsPerPageOptions={[10, 15, 20]}
            disableSelectionOnClick
            autoHeight={false}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}



