import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, Box } from '@mui/material';
import api from '../api/clientApi';

const SHEET_ID = '1qVl2__hq4Fs4KIfQQbccvK7mWizFL0hPvJUHa7UW8zQ';
const API_KEY = 'AIzaSyCYOXexYdFusZZJjmNSZcMYu0waJ2i0XieG';
const RANGE = 'Liva!A2:O'; // À adapter selon ton onglet et plage exacte

export default function LivraisonList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function fetchLivraisonsFromSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await api.get(url);
    const data = res.data.values || [];
    if (data.length === 0) return [];

    const headers = [
      'horaire', 'demandeur', 'colis', 'réf devis', 'client', 'entreprise', 'destination',
      'accès livraison', 'infos', 'téléphone', 'prévenu', 'prix', 'fait'
    ];

    setColumns(
      headers.map((h, index) => ({
        field: `col${index}`,
        headerName: h,
        flex: 1,
        minWidth: 100,
      }))
    );

    return data.map((row, i) => {
      const obj = { id: i };
      headers.forEach((_, j) => {
        obj[`col${j}`] = row[j] || '';
      });
      return obj;
    });
  }

  async function loadData() {
    setLoading(true);
    try {
      const deliveries = await fetchLivraisonsFromSheet();
      setRows(deliveries);
    } catch (e) {
      console.error('❌ Erreur de chargement des livraisons :', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ height: '90vh', width: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>📦 Livraisons Google Sheets</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{ backgroundColor: 'white', borderRadius: 2 }}
        />
      )}
    </Box>
  );
}
