const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
var expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// npm i connect-mongo@3 is to be used for using this format
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

//Cross-origin resource sharing (CORS) is a browser mechanism which enables controlled access to resources
// located outside of a given domain
app.use(cors());

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix:  '/css'
}));


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('./assets'));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

//extracting styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name : 'socialcode',
    // change the secret key before deployment in production
    secret : 'randomsomething',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : new MongoStore( //mongoStore is used to store the session cookie in the db
        {
            mongooseConnection : db,
            autoRemove : 'diabled'
        },function(err) {
            console.log(err || "connect-mongodb setup OK");
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log('Error in running server : ', err);
    }

    console.log(`Server is running on port : ${port}`);
});