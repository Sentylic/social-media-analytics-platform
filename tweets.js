/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var elastic_connector = require('./elastic-connector');
var jsonfile = require("jsonfile");
var fs = require("fs");

function readJsonFiles() {
    return new Promise(function (resolve, reject) {
        var json_files = [];
        fs.readdir('./Data', (err, files) => {
            if (err) {
                reject(err);
            }
            files.forEach(file => {
                json_files.push(file.split(".")[0]);
            });
            resolve(json_files);
        });
    });
}

router.get('/', function (req, res) {

    readJsonFiles().then(function (json_files) {
        res.render('index', {files : json_files, req: req});
    });
});

router.get('/:index', function (req, res) {
    var files = null;
    readJsonFiles().then(
        function (json_files) {
            files = json_files;
            elastic_connector.getNodes(req.params.index).then(
                function (data) {
                    jsonfile.writeFile('./public/json/graph.json', data);
                },
                function (err) {
                    console.log(err);
                    return res.send(err);
                }
            );
        },
        function (err) {
            console.log(err);
            return res.send(err);
        }
    ).then(function () {
        res.render('graph', {files : files, req: req});
    });
});


//export this router to use in our index.js
module.exports = router;