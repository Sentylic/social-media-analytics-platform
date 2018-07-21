/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var util = require("./util");
var fs = require("fs");


router.get('/', function (req, res) {
    util.readJsonFiles('./Reviews').then(function (json_files) {
        res.render('places', {files: json_files, req: req});
    });
});

router.get('/reviews', function (req, res) {
    return res.send(req);
});

router.post('/reviews', function(req, res){
    fs.readFile('./Reviews/' + req.body.place + ".json", function (err, data) {
        if (err) {
            return res.send(err);
        }
        data = JSON.parse(data);
        // console.log(data);
        const LENGTH_OF_REVIEW = 100;
        temp = data.filter(function (d) {
            if (d.Review.length > LENGTH_OF_REVIEW) {
                return d.Review = d.Review.toString().slice(0, LENGTH_OF_REVIEW) + "...";
            }
        });
        // console.log(temp);
        return res.send(temp);
    })
});


//export this router to use in our index.js
module.exports = router;