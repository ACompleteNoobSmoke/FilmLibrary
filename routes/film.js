const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Film Index Page');
})

module.exports = router;