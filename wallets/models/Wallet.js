const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    solde: {
        type: Number,
        default: 0
      },
      utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;