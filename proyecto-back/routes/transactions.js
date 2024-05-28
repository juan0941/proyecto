const router = require('express').Router();
const Transaction = require('../Schema/transaction'); // Asegúrate de que el esquema Transaction esté correctamente definido

// Obtener todas las transacciones del usuario autenticado
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }
        
        const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ error: "Error al obtener las transacciones" });
    }
});

// Crear una nueva transacción
router.post('/', async (req, res) => {
    const { type, amount, description } = req.body;

    if (!type || !amount) {
        return res.status(400).json({ error: "Tipo y monto son requeridos" });
    }

    if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    try {
        const transaction = new Transaction({
            type,
            amount,
            description: description || '',
            userId: req.user.id,
        });

        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction); // Respondemos con código 201 para indicar que se ha creado correctamente
    } catch (error) {
        console.error("Error al guardar la transacción:", error);
        res.status(500).json({ error: "Error al guardar la transacción" });
    }
});

// Eliminar una transacción por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transacción no encontrada" });
        }
        res.json({ message: "Transacción eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la transacción:", error);
        res.status(500).json({ error: "Error al eliminar la transacción" });
    }
});

module.exports = router;
