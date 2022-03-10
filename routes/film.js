const express = require('express');
const Film = require('../model/film');
const User = require('../model/user');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Film Index Page');
})

router.get('/new', async (req, res) => {
    renderNewPage(res, new Film());
})

router.post('/', async (req, res) => {
    const newFilm = new Film({
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
    }catch{
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
            let message = (form == 'edit') ? 'Error Editing Book' : 'Error Creating Book';
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