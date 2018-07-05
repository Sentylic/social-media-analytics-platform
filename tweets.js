/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();
var elastic_connector = require('./elastic-connector');
var jsonfile = require("jsonfile");
var fs = require("fs");
const path = require('path');
var formidable = require('formidable');

var util = require("./util");
var curl = require('curlrequest');
var elasticsearch = require('elasticsearch');
var read = require('read-file');

router.get('/add', function (req, res) {
    util.readJsonFiles().then(function (json_files) {
        res.render('new_discussion', {files: json_files, req: req});
    });
});

router.post('/add', function (req, res) {
    const upload_path = path.join(__dirname, "./Data/");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // oldpath : temporary folder to which file is saved to
        var oldpath = files.discussion_file.path;
        var newpath = upload_path + files.discussion_file.name;
        // copy the file to e new location
        fs.rename(oldpath, newpath, function (err) {
            if (err) res.send(err);

            var ext = path.extname(files.discussion_file.name);
            if (ext == '.json') {
                var index_name = files.discussion_file.name.replace(ext, '');

                var options_delete_index = {
                    url: 'localhost:9200/' + index_name
                    , method: 'DELETE'
                };
                var options_create_index = {
                    url: 'localhost:9200/' + index_name + '?pretty'
                    , method: 'PUT',
                    headers: {'Content-Type': 'application/json'}
                };
                var options_post_to_index = {
                    url: 'localhost:9200/' + index_name + '/_bulk?pretty'
                    , method: 'POST',
                    headers: {'Content-Type': 'application/x-ndjson'},
                    json: true,
                };


                curl.request(options_delete_index, function (err, data) {
                    if (err) {
                        req.flash('danger', err.toString());
                        res.redirect('/');
                    }

                    curl.request(options_create_index, function (err, data) {
                        if (err) {
                            req.flash('danger', err.toString());
                            res.redirect('/');
                        }


                        fs.readFile(newpath, 'utf8', function (err, file_data) {
                            if (err) {
                                req.flash('danger', err.toString());
                                res.redirect('/');
                            }

                            var client = new elasticsearch.Client({
                                host: 'localhost:9200',
                                log: 'trace'
                            });

                            file_data = file_data.toString().split('\n')
                            client.bulk({
                                body: file_data
                            }, function (err, resp) {
                                if (err) {
                                    req.flash('danger', err.toString());
                                    return res.redirect('/');
                                }
                                req.flash('success', 'New discussion <' + index_name + '> was added!');
                                res.redirect('/');
                            });
                        })
                    });
                });
            } else {
                fs.unlink(newpath, (err) => {
                    if (err) res.send(err);
                    console.log(files.discussion_file.name + ' was deleted');
                    req.flash('danger', 'Invalid file format(' + ext + '). Only ".json" supported!');
                    res.redirect('/tweets/add');
                });
            }


            // req.flash('success', "<" + path.extname(files.discussion_file.name) + "> file uploaded!");
            // res.redirect('/');
        });
    });
});

router.get('/:index', function (req, res) {
    var files = null;
    util.readJsonFiles().then(
        function (json_files) {
            files = json_files;
            elastic_connector.getNodes(req.params.index).then(
                function (data) {
                    jsonfile.writeFile('./public/json/graph.json', data);
                    res.render('graph', {files: files, req: req, title: req.params.index});
                },
                function (err) {
                    console.log(err);
                    if (err.toString().includes("[index_not_found_exception]")) {
                        req.flash('danger', "<" + req.params.index + "> file is not added to elasticsearch!");
                    }
                    res.redirect('/');
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