const express = require('express');


const router = express.Router();

router.get('/', (req, res) =>{
    console.log('Bienvenue sur le server de Campus Event');
    res.send('Bienvenue sur le Server');
});

module.exports = router;