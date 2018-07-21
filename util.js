/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var jsonfile = require("jsonfile");
var fs = require("fs");
var pyshell = require('python-shell');
var path = require('path');

module.exports = {

    readJsonFiles: function (path) {
        return new Promise(function (resolve, reject) {
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

    scrapeTripAdvisor: function(link, max_reviews) {
        return new Promise(function(resolve, reject) {
            var options = {
                mode: 'text',
                args: ['-o', path.resolve(__dirname, 'tripadvisor-scraper/Rithu_Restaurant-Sigiriya_Central_Province.json'), '-n', max_reviews.toString(), '-e', 'phantomjs', link]
            };
            var shell = new pyshell('tripadvisor-scraper/scraper.py', options);
            shell.end(function(err, code, signal) {
                if (err) {
                    console.log('tripadvisor-scraper error');
                    console.log(err);
                    reject(err);
                } else {
                    var data = fs.readFileSync(path.resolve(__dirname, 'tripadvisor-scraper/Rithu_Restaurant-Sigiriya_Central_Province.json'), 'utf8');
                    resolve(data);
                }
            });
        });
    }
};