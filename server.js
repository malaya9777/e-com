const express = require('express');
const mongodb = require('mongodb');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const cookieParser =require('cookie-parser');
const session = require('express-session');
const crypto =require('crypto');


const app = express();
const upload = multer();
const port = 8181;

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret:crypto.randomBytes(20).toString("hex"), resave:true, saveUninitialized:true}))


app.set('views', path.join(__dirname, 'public/views'));
app.use('/css', express.static(path.join(__dirname,'public/css')));
app.use('/img', express.static(path.join(__dirname,'public/img')));
app.use('/assests', express.static(path.join(__dirname,'public/assests')));
app.use('/js', express.static(path.join(__dirname,'public/js')));


app.get('/', async(req, res)=>{
    console.log('Request received')
    res.render('index');
});

app.get('/admin', async(req,res)=>{
    res.render('admin_index')
});

app.get('/admin/dashboard', checkSignin, async(req, res)=>{
    res.render('admin_dashboard')
});

function checkSignin(req, res, next){
    if(req.session.user){
        next();
    }else{
        next(new Error('User Not logged in!'))
    }
}



app.listen(port, console.log(`Listning on port ${port}`));