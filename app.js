const express = require('express');
const mongoose = require('mongoose');
const authRouters = require('./routes/authRoutes');

const link = 'http://localhost:5432'

const app = express();

console.log(`Server listening in ${link}`)

// Middleware
app.use(express.static('public'));
app.use(express.json());

// View Engine
app.set('view engine', 'ejs');

// Database Connection
const dbURI = 'mongodb+srv://gabrielkoti14:gGNUFZQlC3YrEUhr@cluster0.g5ejonq.mongodb.net/node-auth'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5432))
    .catch((err) => console.log(err));

// Rotas
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRouters)
