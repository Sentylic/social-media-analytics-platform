/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var app = express();
var tweets = require('./tweets');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views','./views');

app.use('/tweets', tweets);

//home route
app.get('/', function (req, res) {
    res.render('index', {title : 'Helooo', author : 'Chamod'})
});

//unmatched routes(404)
app.get('*', function (req, res) {
    res.send('Sorry, this is an invalid URL.');
});

app.listen(3000);