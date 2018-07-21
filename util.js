/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var jsonfile = require("jsonfile");
var fs = require("fs");
var pyshell = require('python-shell');
var path = require('path');
var request = require('request');

module.exports = {

    readJsonFiles: function(path) {
        return new Promise(function(resolve, reject) {
            var json_files = [];
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err);
                }
                files.forEach(file => {
                    var f = file.split(".");
                    if (f[1] == 'json') {
                        json_files.push(f[0]);
                    }
                });
                resolve(json_files);
            });
        });
    },

    scrapeTripAdvisor: function(link, max_reviews, output_file) {
        return new Promise(function(resolve, reject) {
            var options = {
                mode: 'text',
                args: ['-o', path.resolve(__dirname, 'tripadvisor-scraper'), '-n', max_reviews.toString(), '-e', 'phantomjs', link]
            };
            var shell = new pyshell('tripadvisor-scraper/scraper.py', options);
            var output_file = path.resolve(__dirname, 'tripadvisor-scraper/output.json');
            shell.on('message', function(msg) {
                if (msg.startsWith('output_file:')) {
                    output_file = msg.substring(12);
                }
            })
            shell.end(function(err, code, signal) {
                if (err) {
                    console.log('tripadvisor-scraper error');
                    console.log(err);
                    reject(err);
                } else {

                    var data_str = fs.readFileSync(output_file, 'utf8');
                    resolve({
                        output_file_name: output_file,
                        data: JSON.parse(data_str)
                    });
                }
            });
        });
    },

    extractAspects: function(review) {
        return new Promise(function(resolve, reject) {
            request("http://127.0.0.1:5001/" + review, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                if (response) {
                    resolve(response.body.toString().split(';'));
                } else {
                    resolve(null);
                }
            });
        });
    }
};