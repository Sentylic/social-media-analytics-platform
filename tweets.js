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
        fs.readdir('./public/json', (err, files) => {
            if (err) {
                reject(err);
            }
            files.forEach(file => {
                json_files.push(file);
            });
            resolve(json_files);
        });
    });
}

router.get('/:index', function (req, res) {
    readJsonFiles().then(
        function (json_files) {

            console.log(json_files);
            // res.send(result);
            elastic_connector.getNodes(req.params.index).then(
                function (data) {
                    jsonfile.writeFile('./public/json/graph.json', data, function () {
                        return res.sendfile('./public/html/graph.html');
                        // res.send(data);
                        // console.log('Hello');
                        // res.render('graph')
                        // return res.render('index',{}, function (err, html) {
                        //     console.log('came ' + err + html);
                        //     if (err) res.send(err);
                        //     else res.send(html)
                        // });
                    });
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
    );
});


//export this router to use in our index.js
module.exports = router;