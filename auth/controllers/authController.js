const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Wallet = require('../../wallets/models/Wallet');

exports.register = async (req, res) => {
  console.log("Le body de la requete", req.body);
  try {
    if (!req.body.password) {
      return res.status(400).json({ error: 'Le mot de passe est requis.' });
    }

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

    const newWallet = new Wallet({
      user: newUser._id,
      balance: 0, 
    });
    await newWallet.save();
    // Générer un token JWT
    const token = jwt.sign({ user: newUser._id }, process.env.SECRET_KEY
    );

    res.status(201).json({
      message: 'Compte créé avec succès.',
      user: safeUserData,
      balance,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { telephone, password } = req.body;
    if (!telephone || !password) {
      return res.status(400).json({ error: 'Veuillez fournir un numéro de téléphone et un mot de passe.' });
    }

    const user = await User.findOne({ telephone });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      return res.status(405).json({ error: 'Portefeuille non trouvé' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Numéro de téléphone ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    const safeUserData = {
      nom: user.nom,
      prenom: user.prenom,
      genre: user.genre,
      telephone: user.telephone,
      email: user.email,
      id: user._id,
    };

    res.status(200).json({
      token,
      user: safeUserData,
      balance: wallet.balance, // Renvoyer la balance du portefeuille
      message: 'Utilisateur connecté avec succès.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'authentification.' });
  }
};


exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    req.user = null;
    res.status(200).json({ success: true, message: 'Déconnexion réussie.' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la déconnexion.' });
  }
};
