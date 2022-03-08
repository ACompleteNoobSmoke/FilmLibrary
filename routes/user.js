const express = require('express');
const Film = require('../model/film');
const User = require('../model/user');
const router = express.Router();





//Route to the index page for users
//Displays all the users in the database
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


//Route to the page that the user gets to create
//a new user
router.get('/new', async(req, res) => {
    res.render('user/new', {user: new User()});
})


//Route to the page where the information from the
//new user form is passed and then saved to the database
router.post('/', async (req, res) =>{
    let userName = req.body.name.trim();
    let exists = await userExists(userName);
    if(exists){ return res.redirect('/');}
    const user = new User({name: userName });

    try{
        const newUser = await user.save();
        res.redirect(`user/${newUser.id}`);
    }catch{
        res.redirect('/');
    }
})

router.get('/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.render('user/show', {user: user});
    }catch{
        res.redirect('/');
    }
})



async function userExists(userName){
     let exists = false;
     userName = userName.toUpperCase();
    const existingUsers =  await User.find({});
    existingUsers.forEach(user => {
         if(userName === user.name.toUpperCase()) exists = true; 
    })
    return exists;
 }

module.exports = router;