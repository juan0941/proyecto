const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const User = require('../Schema/user');
const getUserInfo = require('../lib/getUserInfo');  // Cambiado a require

router.post('/', async (req, res) => {  
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(jsonResponse(400, {
            error: 'Todos los campos son requeridos',
        }));
    }

    const user = await User.findOne({ username });

    if (user) {
        const correctPassword = await user.comparePassword(password, user.password);

        if (correctPassword) {
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();
        
            return res.status(200).json(jsonResponse(200, { user: getUserInfo(user), accessToken, refreshToken }));
        } else {
            return res.status(400).json(
                jsonResponse(400, {
                    error: 'Usuario o contraseña incorrecto',
                })
            );
        }
    } else {
        return res.status(400).json(
            jsonResponse(400, {
                error: 'Usuario no existe',
            })
        );
    }
});

module.exports = router;
