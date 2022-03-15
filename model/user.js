const mongoose = require('mongoose');
const Film = require('../model/film');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

userSchema.pre('remove', function(next){
    Film.find({user: this.id}, (error, films) => {
        if(error){
          next(error)  
        } else if(films.length > 0){
            next(new Error('This user has film still'))
        }else{
            next()
        }
    })
})


module.exports = mongoose.model('User', userSchema);