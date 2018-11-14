/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var util = require("./util");

var request = require('request');

var PythonShell = require('python-shell');

const EMOTION_HOST = '192.168.8.102'; //'111.223.140.244';
const EMOTION_PORT = 5001;

const {check, validationResult} = require('express-validator/check')

router.get('/', function (req, res) {
    util.readJsonFiles('./Data').then(function (json_files) {
        res.render('emotions', {files: json_files, req: req});
    });
});

router.post('/findEmotions', [
    check('message')
        .isLength({min: 1})
        .withMessage('Review is required'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('emotions', {
            data: req.body,
            errors: errors.mapped(),
        })
    }

    request("http://" + EMOTION_HOST + ":" + EMOTION_PORT + "/emo?tweet='" + req.body.message + "'",
        function (error, response, body) {
            emotions = []
            if (body) {
                data = body.toString().replace('[', '').replace(']', '').replace("'", '').split(',');
                for (e in data) {
                    emotions.push(data[e].trim(" ").replace("\"", '').replace("\"", '').replace("\n", ''));
                }
            }
            util.readJsonFiles('./Data').then(function (json_files) {
                return res.render('emotions', {
                    data: req.body,
                    emotions: emotions,
                    files: json_files, req: req
                })
            });
        });
})

router.post('/findReviewEmotions', function (req, res) { //111.223.150.141
    request("http://" + EMOTION_HOST + ":" + EMOTION_PORT + "/emo?tweet='" + req.body.review + "'",
        function (error, response, body) {

            console.log('review : ' + req.body.review)
            console.log('body : ' + body)

            emotions = []

            if (body) {
                data = body.toString().replace('[', '').replace(']', '').replace("'", '').split(',');
                for (e in data) {
                    emotions.push(data[e].trim(" ").replace("\"", '').replace("\"", '').replace("\n", ''));
                }
            }
            return res.send(emotions);
        });
});


//export this router to use in our index.js
module.exports = router;