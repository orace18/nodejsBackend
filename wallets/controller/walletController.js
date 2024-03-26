const Wallet = require('../models/Wallet');

// Contrôleur pour la recharge d'argent
const rechargeArgent = async (req, res) => {
    const { montant } = req.body.montant;
    const { id } = req.body.id;

    try {
        const wallet = await Wallet.findOne({ user: user.id });

        if (!wallet) {
            return res.status(404).json({ message: "Portefeuille non trouvé" });
        }

        wallet.solde += montant;
        await wallet.save();

        return res.status(200).json({ message: "Recharge d'argent effectuée avec succès", wallet });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la recharge d'argent", error: error.message });
    }
};

// Contrôleur pour le retrait d'argent
const retraitArgent = async (req, res) => {
    const { montant } = req.body;
    const { utilisateur } = req.params;

    try {
        const wallet = await Wallet.findOne({ utilisateur });

        if (!wallet) {
            return res.status(404).json({ message: "Portefeuille non trouvé" });
        }

        if (wallet.solde < montant) {
            return res.status(400).json({ message: "Solde insuffisant pour effectuer le retrait" });
        }

        wallet.solde -= montant;
        await wallet.save();

        return res.status(200).json({ message: "Retrait d'argent effectué avec succès", wallet });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors du retrait d'argent", error: error.message });
    }
};

module.exports = { rechargeArgent, retraitArgent };