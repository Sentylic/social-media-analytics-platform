/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var util = require("./util");
var aspect_analyzer = require("./aspect_analyzer");
var fs = require("fs");


router.get('/:place_name*?', function (req, res) {
    util.readJsonFiles('./tripadvisor-scraper/').then(function (review_files) {
        util.readJsonFiles('./Data/').then(function (json_files) {
            res.render('places', {files : json_files, review_files: review_files, req: req, place_name: req.params.place_name});
        });
    });
});

router.post('/reviews', function(req, res){
    fs.readFile('./tripadvisor-scraper/' + req.body.place + ".json", function (err, review_data) {
        if (err) {
            return res.send(err);
        }
        review_data = JSON.parse(review_data);

        aspect_analyzer.findPopularAspects(review_data).then(function (data) {
            var obj = {
                aspects : data,
                reviews : review_data
            };
            return res.send(obj);
            console.log(data);
        }, function (err) {
            console.log(err);
            return res.send(err);
        });
        // console.log(temp);
    })
});


//export this router to use in our index.js
module.exports = router;