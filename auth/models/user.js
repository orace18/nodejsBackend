const express =  require('express');
const mongoose = require('mongoose');


const userSchema = mongoose.Schema(
    {
        nom:{
            type: String,
            required: true,
        },
        prenom: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
            required: true,
            unique: true,
        },
        genre:{
            type: String,
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        portefeuille: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Portefeuille'
          }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
