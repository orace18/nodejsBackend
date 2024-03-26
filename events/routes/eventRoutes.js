const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../../auth/middlewares/authMiddleware');


router.post('/create',verifyToken ,eventController.createEvent);
router.get('/getAllEvent',verifyToken, eventController.getAllEvents);
router.delete('/deleteEvent/:id',verifyToken ,eventController.deleteEvent);
router.put('/updateEvent/:id',verifyToken ,eventController.updateEvent);


module.exports = router;
