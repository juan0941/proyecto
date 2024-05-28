const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const User = require('../Schema/user');

router.post('/', async (req, res) => {  
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json(jsonResponse(400, {
            error: 'Todos los campos son requeridos',
        }));
    }

    try {
        const exists = await User.usernameExists(username);  // Corregido el nombre del método

        if (exists) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: 'El usuario ya existe'
                })
            );
        }

        const newUser = new User({ username, name, password });
        await newUser.save(); // Guardar el usuario en la base de datos
        return res.status(201).json(jsonResponse(201, { message: 'Usuario creado' }));
    } catch (err) {
        if (err.name === 'ValidationError' || err.code === 11000) {  // Manejo de errores específicos
            return res.status(400).json(jsonResponse(400, {
                error: 'El usuario ya existe'
            }));
        }
        return res.status(500).json(jsonResponse(500, {
            error: 'Error al crear el usuario',
            details: err.message
        }));
    }
});

module.exports = router;
