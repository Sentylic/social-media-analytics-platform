/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var util = require("./util");
var request = require('request');

var PythonShell = require('python-shell');

const { check, validationResult } = require('express-validator/check')


router.get('/scrape', function(req, res) {
    max_reviews = req.query.max_reviews || 20
    link = req.query.link || 'https://www.tripadvisor.com/Restaurant_Review-g293962-d1132743-Reviews-Barefoot_Garden_Cafe-Colombo_Western_Province.html'
    output_file = req.query.output_file // may or may note be undefined
    util.scrapeTripAdvisor(link, max_reviews, output_file).then(function(data) {
        res.send(data);
    });
});

router.get('/', function(req, res) {
    util.readJsonFiles('./Data').then(function(json_files) {
        res.render('aspects', { files: json_files, req: req });
    });
});

router.post('/findAspects', [
    check('message')
    .isLength({ min: 1 })
    .withMessage('Review is required'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('aspects', {
            data: req.body,
            errors: errors.mapped(),
        })
    }

    request("http://127.0.0.1:5001/" + req.body.message, (err, response, body)=> {
        if (err){
            res.send("Please make sure the Aspect Extraction server is running in port 127.0.0.1:5001");
        }

        aspects = []
        aspect_terms = body.split(';');

        // put a random sentiment for now (aspect based sentiment part is not implemented yet)
        for(var i in aspect_terms){
            aspects.push({
                aspect : aspect_terms[i],
                sentiment: Math.floor(Math.random() * (2 - (-1))) + (-1)
            });
        }

        // send with sample data json
        util.readJsonFiles('./Data').then(function (json_files) {
            return res.render('aspects', {
                data: req.body,
                aspects: aspects,
                files: json_files,
                req: req
            })
        });
    });

})

//export this router to use in our index.js
module.exports = router;