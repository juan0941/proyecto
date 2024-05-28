const { jsonResponse } = require('../lib/jsonResponse');
const getTokenFromHeader = require('./getTokenFromHeader');
const { verifyAccessToken } = require('./verifyToken');

function authenticate(req, res, next) {
    const token = getTokenFromHeader(req.headers);
    if(token) {
        const decodeb = verifyAccessToken(token);
        if(decodeb) {
            req.user = { ...decodeb.user};
            next();
        } else{
            res.status(401).json(jsonResponse(401,{
                message: 'no tiene token',
            }))
    }}
 else{
    res.status(401).json(jsonResponse(401,{
        message: 'no tiene token',
    }))
}
}

module.exports = authenticate;