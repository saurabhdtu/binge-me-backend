const languages = require('./languages')
const genres = require('./genres')
const users = require('./users')
const content_platforms = require('./content_platforms')
function setUpRoutes(app){
    app.get('/', (req, res)=>{
        res.render('index',{title:"Hello there", message:"Welcome to binge me app"})
    });

    app.use('/api/languages', languages.routes)
    app.use('/api/genres', genres.routes)
    app.use('/api/users', users.routes)
    app.use('/api/content-platforms', content_platforms.routes)
}

module.exports = setUpRoutes