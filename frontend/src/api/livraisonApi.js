import api from './clientApi';

// Récupère les livraisons pour le mois de MAI et le pole donné
export async function fetchLivraisons(pole) { // MODIF : n’accepte plus deux args, juste le pole
  const resp = await api.get('/deliveries', {
    params: {
      mois: "MAI",  // MODIF : mois fixé à MAI
      pole         // valeur passée depuis le composant
    }
  });
  return resp.data; // attendu : soit un tableau, soit { deliveries: [...] }
}

// Synchronise la feuille Google Sheet pour le pole donné
export async function syncLivraisons(pole) { // MODIF : nouvelle fonction exportée
  const resp = await api.post(
    '/deliveries/sync-sheet',
    { pole }      // MODIF : on envoie le pole en payload
  );
  return resp.data; // { message: "...", count: N }
}
