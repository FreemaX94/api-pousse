// File: backend/controllers/comptoirfleuriste.controller.js

/**
 * Controller pour traiter l'import depuis l'extension Chrome ComptoirFleuriste.
 * Attendu dans req.body : { photo, name, price, diameter, height }
 */
exports.importComptoirFleuriste = async (req, res) => {
  try {
    const { photo, name, price, diameter, height } = req.body;

    // TODO: Adapter selon votre logique métier / modèle de données
    // Ex. :
    // const newItem = await Item.create({
    //   source: 'comptoirfleuriste',
    //   photo,
    //   name,
    //   price,
    //   dimensions: { diameter, height }
    // });

    // Pour l'instant, on renvoie simplement les données reçues
    const newItem = { id: Date.now(), photo, name, price, diameter, height };

    return res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error('Import ComptoirFleuriste failed:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
