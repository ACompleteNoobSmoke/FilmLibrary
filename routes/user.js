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
    const user = new User({name: userName });
    if(exists){ 
        return res.render('user/new', {
            user:user,
            errorMessage: `${userName} Exists In Database\nPlease Pick Another Name`
        });
    }

    try{
        const newUser = await user.save();
        res.redirect(`user/${newUser.id}`);
    }catch{
        res.render('user/new', {
            user:user,
            errorMessage: `Error Adding User To Database`
        });
    }
})

//Routes to the user profile page
router.get('/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const film = await Film.find({user: user.id});
        res.render('user/show', {user: user, films:film});
    }catch{
        res.redirect('/');
    }
})

//Routes to the user edit page
router.get('/:id/edit', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.render('user/edit', {user:user});
    }catch{
        res.redirect('user/');
    }
});

//Edits the user name if it doens't already exist in database
router.put('/:id', async(req, res) => {
    let newName = req.body.name.trim();
    let exists = await userExists(newName);
    let user;

    try{
        user = await User.findById(req.params.id);
        if(exists && user != null){ 
            return res.render(`user/edit`, {
                user:user,
                errorMessage: 'Error Updating The User!'
            });
        }
        user.name = newName;
        await user.save();
        res.redirect(`/user/${user.id}`);
    }catch{
        res.redirect('user/')
    }
})

//Delete the user from the Database
router.delete('/:id', async(req, res) => {
    let deletedUser;
    try{
        deletedUser = await User.findById(req.params.id);
        await deletedUser.remove();
        res.redirect('/user');
    }catch{
        let redirectURL = (deletedUser == null) 
        ? '/' : `/user/${deletedUser.id}`
        res.redirect(redirectURL);
    }
})



//Checks the database to see if the name already exists.
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