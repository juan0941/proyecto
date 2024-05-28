const { jsonResponse } = require('../lib/jsonResponse');

const router = require('express').Router();

router.post('/', (req, res) => {
    res.send('singout')
});

module.exports = router;