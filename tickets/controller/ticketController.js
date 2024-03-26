const express = require('express');
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const Event = require('../../events/models/Event'); 

exports.createTicket = async (req, res) => {
  try {
    const { nom, nombreDePlace, typeDeTicket, event } = req.body;

    // Check if event exists before creating ticket
    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return res.status(400).json({ error: 'Event not found' });
    }

    const newTicket = new Ticket({
      nom,
      nombreDePlace,
      typeDeTicket,
      event: existingEvent._id
    });

    await newTicket.save();

    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

exports.getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id)
      .populate('event');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Error retrieving ticket' });
  }
};

exports.getAllTicketByEvent = async (req, res) => {
  const { evenementId } = req.params;

  try {
    const tickets = await Ticket.find({ event: evenementId });

    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    res.status(500).json({ error: 'Error retrieving tickets' });
  }
};

exports.getOneTicketEventById = async (req, res) => {
  const { id, evenementId } = req.params;

  try {
    const ticket = await Ticket.findOne({ _id: id, event: evenementId });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Error retrieving ticket' });
  }
};

module.exports = exports;
