const express = require('express');
const mongodb = require('mongodb');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const bodyParser = require('body-parser');


const app = express();
const upload = multer();
const port = 8181;
const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb+srv://malayaAdmin:AWrairfqITBmkrej@cluster0.yw3xa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(upload.array());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: crypto.randomBytes(20).toString("hex"), resave: true, saveUninitialized: true }))


app.set('views', path.join(__dirname, 'public/views'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/assests', express.static(path.join(__dirname, 'public/assests')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


app.get('/', async (req, res) => {
    console.log('Request received')
    res.render('index');
});

app.get('/admin', async (req, res) => {
    res.render('admin_index', { title: 'Admin' })
});
app.post('/admin/login', async (req, res) => {
    console.log(req.body)
    if (!req.body.username || !req.body.password) {
        res.render('admin_index', { title: 'Login failed', message: 'Both username and password is required!', messageType: false })
    } else {
        const client = await mongoClient.connect(mongoURL);
        const db = await client.db('e-Com');
        const md5sum = crypto.createHash('md5');
        req.body.password = md5sum.update(req.body.password).digest('hex');
        console.log(req.body);
        const user = await db.collection('Login').findOne(req.body);
        console.log(user);
        if (user) {
            req.session.user = user;
            res.redirect('/admin/dashboard')
        } else {
            res.render('admin_index', { title: 'Login failed', message: 'Username or password!', messageType: true })
        }

    }
});

app.post('/admin/create', checkSignin, async (req, res) => {
    const client = await mongoClient.connect(mongoURL);
    const db = await client.db('e-Com');
    const md5sum = crypto.createHash('md5');
    req.body.password = md5sum.update(req.body.password).digest('hex');
    await db.collection('Login').insertOne(req.body);
    res.render('admin_index', { title: 'User created', message: 'User successfully created!', messageType: true })
});

app.get('/admin/dashboard', checkSignin, async (req, res) => {
    res.render('admin_dashboard');
});
app.get('/admin/profile', checkSignin, async(req, res)=>{
    res.render('admin_profile')
});
app.get('/admin/logout', checkSignin, async(req, res)=>{
    delete req.session.user;
})

function checkSignin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/admin')
    }
}



app.listen(port, console.log(`Listning on port ${port}`));