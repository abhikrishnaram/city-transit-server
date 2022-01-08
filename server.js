const express = require('express');
const bodyParser = require('body-parser');
const articleRouter = require('./routes/articles')
const quizRouter = require('./routes/quiz')
const apiRouter = require('./routes/api')
const mongoose = require('mongoose');
const Article =  require('./models/article.js');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
var cors = require('cors')
var session = require('express-session');

mongoose 
 .connect(process.env.MONGO_PROD_URI || uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const app = express();
app.use(session({
       secret: 'secret',
       resave: true,
       saveUninitialized: true,
       cookie: {         
            expires: 600000
        }
}));

app.use(express.static(__dirname + '/admin'));
app.set('view engine','ejs')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/login', (req,res)=>{
       res.render('login')
})

app.post('/login/auth', (req,res)=>{
       console.log(req.session)
       if (req.body.name==="admin"&&req.body.pass==="admin") {              
              req.session.loggedin = true;
              res.redirect('/');
       }else{
              res.redirect('/login')
       }

})

app.get('/logout', (req,res)=>{
       req.session.destroy();
       res.redirect('/login')
})

//app.use(authentication)


app.get('/', (req,res)=>{
       if (req.session.loggedin) {             
	      res.render('index')
       } else {
             res.redirect('/login')
       }
})


app.all('/quiz', function (req, res, next) {
    if(req.session.loggedin)
       next(); 
    else
       res.redirect('/login');
});

app.all('/quiz/*', function (req, res, next) {
    if(req.session.loggedin)
       next(); 
    else
       res.redirect('/login');
});

app.all('/blog', function (req, res, next) {
    if(req.session.loggedin)
       next(); 
    else
       res.redirect('/login');
});

app.all('/blog/*', function (req, res, next) {
    if(req.session.loggedin)
       next(); 
    else
       res.redirect('/login');
});


app.use('/blog',articleRouter)
app.use('/quiz',quizRouter)
app.use(cors())
app.use('/apiv1',apiRouter)

app.listen(process.env.PORT||5000);
