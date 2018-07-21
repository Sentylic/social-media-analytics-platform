/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var jsonfile = require("jsonfile");
var fs = require("fs");

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
};
