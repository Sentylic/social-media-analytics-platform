/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var app = express();
var tweets = require('./tweets');

const exphbs = require('express-handlebars');
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/tweets', tweets);

//home route
app.get('/', function (req, res) {
    res.render('index', {title: 'Helooo', author: 'Chamod'})
});

//unmatched routes(404)
app.get('*', function (req, res) {
    res.send('Sorry, this is an invalid URL.');
});

app.disable('view cache');

app.listen(3000);