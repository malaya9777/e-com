const express = require('express');
const mongodb = require('mongodb');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');
const session = require('express-session');

const app = express();
const upload = multer();
const port = 3005;

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json);
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret:'This is my secret'}))




app.use(express.static('public'));
app.set('views', path.join(__dirname, 'public/views'));
app.use('/css', express.static(__dirname+'public/css'));
app.use('/img', express.static(__dirname+'public/img'));
app.use('/assests', express.static(__dirname+'public/assests'));
app.use('/js', express.static(__dirname+'public/js'));


app.get('/', async(req, res)=>{
    console.log('Request received')
    res.render('index');
});

app.listen(port, console.log(`Listning on port ${port}`));