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

      if (!req.file) { 
        console.error('Aucun fichier téléchargé');
        return res.status(400).json({ message: 'Aucun fichier téléchargé' });
      }

      const { nom, lieu, date, heure } = req.body;

      const newEvent = new Event({
        nom,
        lieu,
        date,
        heure,
        image: req.file.path 
      });

      await newEvent.save();

      res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement :', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement par ID :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement par ID' });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.status(200).json({ message: 'Événement mis à jour avec succès', event: updatedEvent });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.status(200).json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
};
