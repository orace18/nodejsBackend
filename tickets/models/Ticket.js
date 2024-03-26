const exports = require("express");
const mongoose =  require("mongoose");

const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
        required: true
    },
    nom: {
        type: String,
        required: true,
        unique: false,
    },
    typeDeTicket: {
        type: String,
        required: true,
        unique: false,
    },
    nombreDePlace: {
        type: Number,
        required: true,
        unique: false,
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;