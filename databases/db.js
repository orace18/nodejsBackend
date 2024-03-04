const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusevent';
    await mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connecté à la base de données MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
};

module.exports = connectDB;
