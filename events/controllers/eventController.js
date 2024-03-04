const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

exports.createEvent = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error('Multer Error:', err);
        return res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image de l\'événement', error: err });
      }

      if (!req.file) { // Correction : Utiliser req.file au lieu de req.image
        console.error('Aucun fichier téléchargé');
        return res.status(400).json({ message: 'Aucun fichier téléchargé' });
      }

      const { nom, lieu, date, heure } = req.body;

      const newEvent = new Event({
        nom,
        lieu,
        date,
        heure,
        image: req.file.path // Correction : Utiliser req.file au lieu de req.image
      });

      await newEvent.save();

      res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement :', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
  }
};
