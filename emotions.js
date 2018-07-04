/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var util = require("./util");

var request = require('request');

var PythonShell = require('python-shell');


const {check, validationResult} = require('express-validator/check')

router.get('/', function (req, res) {
    util.readJsonFiles().then(function (json_files) {
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

    request("http://127.0.0.1:5000/emo?tweet='" + req.body.message + "'", function (error, response, body) {
        emotions = []
        data = body.toString().replace('[', '').replace(']', '').replace("'", '').split(',');
        for (e in data) {
            emotions.push(data[e].replace("\"", '').replace("\"", '').replace("\n", ''));
        }

        util.readJsonFiles().then(function (json_files) {
            return res.render('emotions', {
                data: req.body,
                emotions: emotions,
                files: json_files, req: req
            })
        });
    });
})

//export this router to use in our index.js
module.exports = router;