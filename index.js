const express = require('express');
require('mongoose');
const environnement = require('dotenv');
const router = require('./auth/routes/initialRoutes');
const authRoutes = require('./auth/routes/authRoutes');
const connectDB = require('./databases/db');
const eventRoutes = require('./events/routes/eventRoutes');

environnement.config();
const port = process.env.port;
const ip = "192.168.100.56";
const app = express();

app.listen(port, ip, ()=>{
    console.log('Le server de Campus Event a démarré sur le port ' + port);
    connectDB();
});

app.use(express.json());
app.use(router);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);