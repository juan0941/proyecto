const router = require('express').Router();
const Todo = require('../Schema/todo');

router.get('/', (req, res) => {
    res.json([
        {
            id: 1,
            title: 'juan',
            completed: false,
        }
    ]);
});

router.post('/', async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: "Titulo requerido" });
    }

    if (!req.user) {
        return res.status(400).json({ error: "Usuario no autenticado" });
    }

    try {
        const todo = new Todo({
            title: req.body.title,
            completed: false,
            idUser: req.user.id,
        });

        const newTodo = await todo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el todo" });
    }
});

module.exports = router;
