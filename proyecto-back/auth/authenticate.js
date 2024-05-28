const { jsonResponse } = require('../lib/jsonResponse');
const getTokenFromHeader = require('./getTokenFromHeader');
const { verifyAccessToken } = require('./verifyToken');

function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers);
    if (token) {
        const decodedToken = verifyAccessToken(token);
        if (decodedToken) {
            req.user = { ...decodedToken.user };
            next();
        } else {
            res.status(401).json(jsonResponse(401, {
                message: 'Token inválido o expirado',
            }));
        }
    } else {
        res.status(401).json(jsonResponse(401, {
            message: 'Token no proporcionado',
        }));
    }
}

module.exports = authenticate;
