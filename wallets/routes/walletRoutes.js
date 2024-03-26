const express =  require('express');
const router = express.Router();
const walletController = require('../controller/walletController');
const verifierToken = require('../../auth/middlewares/authMiddleware');

router.post('/recharger' , walletController.rechargeArgent);
router.post('/retrait', verifierToken, walletController.retraitArgent);