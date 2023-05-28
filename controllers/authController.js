const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===================== Handle Errors ==============================
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    if (err.message === 'Incorrect email') {
        errors.email = 'Email not registered';
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
    }

    // Duplicate user error
    errDuplicateCode = 11000;
    if (err.code === errDuplicateCode) {
        errors.email = 'Email already registered';
        return errors;
    }

    // Validate errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

// ================== Jwt - Token Creation ==========================
const tokenExpiration = 3 * 24 * 60 * 60; // 3 Days

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.jwtSecret, {
        expiresIn: tokenExpiration
    });
};

// ======================= Get Routes ===============================

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

// ======================= Post Routes ===============================

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: tokenExpiration * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: tokenExpiration * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// Logout - jwt returns empty and expires in 1 millisecond
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
