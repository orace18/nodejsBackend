const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout',verifierToken, authController.logout);

module.exports = router;
