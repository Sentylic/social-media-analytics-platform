/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var jsonfile = require("jsonfile");
var fs = require("fs");
var pyshell = require('python-shell');
var path = require('path');
var request = require('request');

const EMOTION_HOST = '111.223.140.244';
const EMOTION_PORT = 5000;
const ASPECTS_HOST = 'sentylic.projects.mrt.ac.lk';
const ASPECTS_PORT = 5001;

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

    scrapeTripAdvisor: function (link, max_reviews, out_f) {
        return new Promise(function (resolve, reject) {
            var options = {
                mode: 'text',
                pythonOptions: ['-u'],
                args: ['-o', path.resolve(__dirname, 'tripadvisor-scraper'), '-n', max_reviews.toString(), '-e', 'phantomjs', link]
            };
            console.log('util.scrapeTripAdvisor')
            console.log('link=' + link)
            console.log('max_reviews=' + max_reviews)
            if (out_f !== undefined) {
                console.log('output_file=' + out_f)
            }
            var shell = new pyshell('tripadvisor-scraper/scraper.py', options);
            var output_file = path.resolve(__dirname, 'tripadvisor-scraper/output.json');
            shell.on('message', function (msg) {
                if (msg.startsWith('output_file:') && out_f === undefined) {
                    output_file = msg.substring(12);
                }
                console.log('tripadvisor-scraper::stdout: ' + msg);
            })
            shell.end(function (err, code, signal) {
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

    extractAspects: function (review) {
        return new Promise(function (resolve, reject) {
            request("http://" + ASPECTS_HOST + ":" + ASPECTS_PORT + "/" + review, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                if (response && response.body && response.body.toString().indexOf("404 Not Found") <= -1) {
                    resolve(response.body.toString().split(';'));
                } else {
                    resolve(null);
                }
            });
        });
    },

    extractEmotions: function (review) {
        return new Promise(function (resolve, reject) { //111.223.150.141
            request("http://" + EMOTION_HOST + ":" + EMOTION_PORT + "/emo?tweet='" + review + "'",
                function (error, response, body) {
                    emotions = []
                    if (body) {
                        data = body.toString().replace('[', '').replace(']', '').replace("'", '').split(',');
                        for (e in data) {
                            emotions.push(data[e].trim(" ").replace("\"", '').replace("\"", '').replace("\n", ''));
                        }
                    }
                    if (error) {
                        reject(error);
                    }
                    resolve(emotions);
                });
        });
    }
};