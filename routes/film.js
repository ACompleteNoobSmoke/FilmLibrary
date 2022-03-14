const express = require('express');
const Film = require('../model/film');
const User = require('../model/user');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const router = express.Router();

router.get('/', async (req, res) => {
    let query = Film.find();
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.genre != null && req.query.genre != ''){
        query = query.regex('genre', new RegExp(req.query.genre, 'i'))
    }
    try{
        const films = await query.exec();
        res.render('film/index', {
            films: films,
            searchOption: req.query
        });
    }catch{
        res.redirect("/")
    }
})

router.get('/new', async (req, res) => {
    renderNewPage(res, new Film());
})

router.post('/', async (req, res) => {
    const newFilm = new Film({
        user: req.body.user,
        title: req.body.title,
        director: req.body.director,
        genre: req.body.genre,
        rating: req.body.rating,
        releaseDate: new Date(req.body.releaseDate)
    })

    saveCover(newFilm, req.body.cover)

    try{
        const film = await newFilm.save();
        res.redirect(`film/${film.id}`);
    }catch(err){
        console.log(err);
        renderNewPage(res, newFilm, true);
    }
})

router.get('/:id', async (req, res) => {
    try{
      const film = await Film.findById(req.params.id);
    res.send(film);  
    }catch{
        res.redirect('/');
    }
    
})

async function renderNewPage(res, film, hasError = false){
    renderFormPage(res, film, 'new', hasError);
}

async function renderEditPage(res, film, hasError = false){
    renderFormPage(res, film, 'edit', hasError);
}

async function renderFormPage(res, film, form, hasError = false){
    try{
        const users = await User.find({});
        const params = {
            users: users,
            film: film
        }
        if(hasError){
            let message = (form == 'edit') ? 'Error Editing Film' : 'Error Creating Film';
            params.errorMessage = message;
        }
        res.render(`film/${form}`, params);
    }catch{
        res.redirect('/films')
    }
}

function saveCover(film, coverEncoded){
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        film.coverImage = new Buffer.from(cover.data, 'base64')
        film.coverImageType = cover.type
    }
}

module.exports = router;