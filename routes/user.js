const express = require('express');
const user = require('../model/user');
const User = require('../model/user');
const router = express.Router();

router.get('/', async (req, res) => {
    let searchOption = {};
    if(req.query.name != null && req.query.name !== ''){
        searchOption.name = new RegExp(req.query.name, 'i');
    }

    try{
        const users = await User.find(searchOption);
        res.render('user/index', {
            users:users,
            searchOptions: req.query});
    }catch{
        res.redirect('/');
    }
})

router.get('/new', async(req, res) => {
    res.render('user/new', {user: new User()});
})

router.post('/', async (req, res) =>{
    const user = new User({
        name: req.body.name
    });

    const newUser = await user.save();
    res.send(newUser);
})

module.exports = router;