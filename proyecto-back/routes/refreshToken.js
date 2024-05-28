const Token = require('../Schema/token');
const { generateAccessToken } = require('../auth/generateTokens');
const getTokenFromHeader = require('../auth/getTokenFromHeader');
const { jsonResponse } = require('../lib/jsonResponse');
const { verifyRefreshToken } = require('../auth/verifyToken');
const router = require('express').Router();

router.post('/', async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);


    if(refreshToken){
        try {
            const found = await Token.findOne({ token:refreshToken});
            if(!found){
                return res.status(401).send(jsonResponse(401, {error: "No autorizado"}));
            }

            const payload = verifyRefreshToken(found.token);
            if(payload){
                const accessToken = generateAccessToken(payload.user);

                return res.status(200).json(jsonResponse(200, { accessToken}))
            }else {
                return res.status(401).send(jsonResponse(401, {error: "No autorizado"}));
            }

        } catch (error) {
            return res.status(401).send(jsonResponse(401, {error: "No autorizado"}));
        }

    }else{
        res.status(401).send(jsonResponse(401, {error: "No autorizado"}));
    }
    
    res.send('refresh Token')
});

module.exports = router;