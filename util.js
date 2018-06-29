/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var jsonfile = require("jsonfile");
var fs = require("fs");

module.exports = {
    readJsonFiles: function () {
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
    },
};
