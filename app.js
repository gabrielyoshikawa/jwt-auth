const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRouters = require('./routes/authRoutes');

const link = 'http://localhost:5432';

const app = express();

console.log(`Server listening in ${link}`);

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View Engine
app.set('view engine', 'ejs');

// Database Connection
const dbURI = 'mongodb+srv://gabrielkoti14:gGNUFZQlC3YrEUhr@cluster0.g5ejonq.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5432))
    .catch((err) => console.log(err));

// Rotas
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRouters);

// Cookies
app.get('/set-cookies', (req, res) => {
    res.cookie('newUser', false)
    cookieExpirationAge = 1000 * 60 * 60 * 24
    res.cookie('isEmployee', true, { maxAge: cookieExpirationAge, secure: true })

    res.send('You got the cookies!')
});

app.get('/read-cookies', (req, res) => {

})