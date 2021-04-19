const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const config = require('config');
const dbDebugger = require('debug')('app:db');// export DEBUG=app:db-debug <namespace:filter> to get debug value for specific debugger
const serverDebug = require('debug')('app:server');// export DEBUG=app* for all the debug values
const morgan = require('morgan');
const authenticator = require('./middlewares/authenticator');

mongoose.connect('mongodb://localhost/binge-me', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB...');
}).catch(err => console.error('error connecting db-', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(helmet());

require('./routes')(app)

if(app.get('env')==="dev"){
    app.use(morgan('dev'));
    serverDebug('morgan enabled');
}
//get config from environment variable
if(!config.get('jwtSecretKey')){
    process.exit(3);
}


app.set('view engine', 'pug');
app.set('views', './views');


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    serverDebug(`${config.get('name')} server started  on ${port}....`);
})