const express = require('express');
const router = express.Router();


//Route to the index page
router.get('/', (req, res) => {
    res.send('We Here Son!');
})

module.exports = router;