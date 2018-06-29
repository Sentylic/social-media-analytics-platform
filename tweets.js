/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var elastic_connector = require('./elastic-connector');
var jsonfile = require("jsonfile");
var fs = require("fs");

var util = require("./util");

router.get('/:index', function (req, res) {
    var files = null;
    util.readJsonFiles().then(
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
        res.set({'Cache-Control': 'no-cache'});
        res.render('graph', {files: files, req: req, title:req.params.index});
    });
});


//export this router to use in our index.js
module.exports = router;