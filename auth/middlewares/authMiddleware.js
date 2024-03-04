const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
  // Accéder au header d'autorisation de manière fiable
  const enteteAutorisation = req.headers.authorization;

  if (!enteteAutorisation) {
    return res.status(401).json({ error: 'Non authentifié, token manquant.' });
  }

  // Extraire le token de l'en-tête
  const token = enteteAutorisation.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Erreur de vérification du jeton :', error);
    return res.status(401).json({ error: 'Non authentifié, token invalide.' });
  }
};

module.exports = verifierToken;
