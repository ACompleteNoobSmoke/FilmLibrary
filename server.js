if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//#region ********** PROJECT RESOURCES **********/

//For express object
const express = require('express');

//Assign express to an app variable
const app = express();

//Get express layouts object
const expressLayouts = require('express-ejs-layouts');

//Get the object for MongoDB/Mongoose
const mongoose = require('mongoose')

//For body-parser object
const bodyParser = require('body-parser');

//For method override object
const methodOverride = require('method-override');

//#endregion





//#region ********** DATABASE RESOURCES **********/

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
});

const db = mongoose.connection;

//This is in the case of an error with the connection
db.on('error', err => console.log(err));

//This is to run once we have connected to the database
db.once('open', () => console.log('Connected To The Database'));

//#endregion


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));




//#region ********** ROUTES **********/

//Route for the index file
const indexRouter = require('./routes/index');

//Route for the user file
const userRouter = require('./routes/user');

//Route for the film file
const filmRouter = require('./routes/film');

//#endregion

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/film', filmRouter);


app.listen(process.env.PORT);