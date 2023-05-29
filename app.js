require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRouters = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();

console.log(`Server listening in ${process.env.link}`);

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View Engine
app.set('view engine', 'ejs');

// Database Connection
const dbURI = process.env.dbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5432))
    .catch((err) => console.log(err));

// Rotas
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/protected', requireAuth, (req, res) => res.render('protected'));
app.use(authRouters);
