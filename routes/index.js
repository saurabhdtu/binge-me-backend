const languages = require('./languages')
const express = require('express');
const genres = require('./genres')
const users = require('./users')
const content_platforms = require('./content_platforms')
const errorHandler = require('../middlewares/error');
const helmet = require('helmet');
function setUpRoutes(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(helmet());
    app.get('/', (req, res) => {
        res.render('index', { title: "Hello there", message: "Welcome to binge me app" })
    });

    app.use('/api/languages', languages.routes)
    app.use('/api/genres', genres.routes)
    app.use('/api/users', users.routes)
    app.use('/api/content-platforms', content_platforms.routes)
    app.use(errorHandler);

    app.set('view engine', 'pug');
    app.set('views', './views');
}

module.exports = setUpRoutes