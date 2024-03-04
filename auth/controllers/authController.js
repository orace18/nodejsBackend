const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const safeUserData = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      genre: req.body.genre,
      telephone: req.body.telephone,
      email: req.body.email,
      password: hashedPassword,
    };

    const newUser = new User(safeUserData);
    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign({ user: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1h', // Durée de vie du token (ici 1 heure)
    });

    res.status(201).json({
      message: 'Compte créé avec succès.',
      user: safeUserData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
};


exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

      const safeUserData = {
        nom: user.nom,
        prenom: user.prenom,
        genre: user.genre,
        telephone: user.telephone,
        email: user.email,
      };

      res.status(200).json({
        token,
        user: safeUserData, 
        message: 'Utilisateur connecté avec succès.'
      });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'authentification.' });
  }
};
