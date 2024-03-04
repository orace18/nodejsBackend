const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../../auth/middlewares/authMiddleware');

router.post('/create', eventController.createEvent);


module.exports = router;
