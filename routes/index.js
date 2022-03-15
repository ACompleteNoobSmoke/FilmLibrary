const express = require('express');
const Film = require('../model/film');
const router = express.Router();


//Route to the index page
router.get('/', async (req, res) => {
    let films;
    try{
        films = await Film.find().limit(5).exec();
    }catch{
        films = [];
    }

    res.render('index', {films:films})

})

module.exports = router;