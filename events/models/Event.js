const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nom: {
     type: String, 
     required: true 
    },
  lieu: { 
    type: String, 
    required: true 
    },
  date: { 
    type: String, 
    required: true 
    },
  heure: { 
    type: String, 
    required: true 
    },
  image:{
    type: String,
    
  }, 
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
