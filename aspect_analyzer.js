/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var util = require("./util");

module.exports = {

    findPopularAspects: function (reviews) {
        return new Promise(function (resolve, reject) {
            var obj = [];
            var aspect_obj = {};
            var aspect_neutral_obj = {};
            var aspect_negative_obj = {};
            var aspect_positive_obj = {};
            var promises = [];

            for (j in reviews) {
                promises.push(util.extractAspects(reviews[j].text).then(function (aspects) {
                    for (i in aspects) {
                        var aspect = aspects[i]; //.trim(" ").trim(".").trim(",").trim("'").toLowerCase();
                        if (aspect[0] != '') {
                            if (aspect[0] in aspect_obj == false) {
                                aspect_obj[aspect[0]] = 1;
                                if (aspect[1] == 0) {
                                    aspect_positive_obj[aspect[0]] = 1;
                                    aspect_negative_obj[aspect[0]] = 0;
                                    aspect_neutral_obj[aspect[0]] = 0;
                                } else if (aspect[1] == 1) {
                                    aspect_neutral_obj[aspect[0]] = 1;
                                    aspect_negative_obj[aspect[0]] = 0;
                                    aspect_positive_obj[aspect[0]] = 0;
                                } else if (aspect[1] == 2) {
                                    aspect_negative_obj[aspect[0]] = 1;
                                    aspect_positive_obj[aspect[0]] = 0;
                                    aspect_neutral_obj[aspect[0]] = 0;
                                }
                            } else {
                                aspect_obj[aspect[0]] += 1;
                                if (aspect[1] == 0) {
                                    aspect_positive_obj[aspect[0]] += 1;
                                } else if (aspect[1] == 1) {
                                    aspect_neutral_obj[aspect[0]] += 1;
                                } else if (aspect[1] == 2) {
                                    aspect_negative_obj[aspect[0]] += 1;
                                }
                            }
                        }
                    }
                }, function (err) {
                    console.log(err)
                }));
            }

            Promise.all(promises).then(function () {
                for (i in aspect_obj) {
                    obj.push({
                        aspect : i,
                        count : aspect_obj[i],
                        positive_percentage: aspect_positive_obj[i] * 100 / aspect_obj[i],
                        negative_percentage: aspect_negative_obj[i] * 100 / aspect_obj[i],
                        neutral_percentage: aspect_neutral_obj[i] * 100 / aspect_obj[i],
                    });
                }

                obj.sort(function (a, b) {
                    return b.count - a.count;
                });
                // console.log(aspect_obj);
                resolve(obj.slice(0, Math.min(10, obj.length)));
            }).catch(function (err) {
                reject(err);
            });
        });
    },

};