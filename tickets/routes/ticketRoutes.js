const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticketController');
const verifierToken = require('../../auth/middlewares/authMiddleware');

router.post('/createTicket',verifierToken  ,ticketController.createTicket);
router.get('/getTicket/:id',verifierToken ,ticketController.getTicketById);
router.get('/getAllTicketByEvent/eventId:',verifierToken ,ticketController.getAllTicketByEvent);
router.get('/getTicketByEvent/eventId:',verifierToken ,ticketController.getOneTicketEventById);


module.exports = router;