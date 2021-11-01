const express = require('express');
const mongodb = require('mongodb');
const ejs = require('ejs');
const path = require('path')

const app = express();
const port = 3000;

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'public/views'));
app.use('/css', express.static(__dirname+'public/css'));
app.use('/img', express.static(__dirname+'public/img'));
app.use('/assests', express.static(__dirname+'public/assests'));
app.use('/js', express.static(__dirname+'public/js'));


app.get('/', async(req, res)=>{

    res.render('index');

});

app.listen(port, console.log(`Listning on port ${port}`));