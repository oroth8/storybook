const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');

// Load config
dotenv.config({path: './config/config.env'})

// passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 8080



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));