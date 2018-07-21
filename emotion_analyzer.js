/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var util = require("./util");

module.exports = {
    findPopularEmotions: function (reviews) {
        return new Promise(function (resolve, reject) {
            var obj = [];
            var emotion_obj = {};
            var promises = [];

            for (j in reviews) {
                promises.push(util.extractEmotions(reviews[j].text).then(function (emotions) {
                    for (i in emotions) {
                        var e = emotions[i];
                            if (e in emotion_obj == false) {
                                emotion_obj[e] = 1;
                            } else {
                                emotion_obj[e] += 1;
                            }
                    }
                }, function (err) {
                    console.log(err)
                }));
            }

            Promise.all(promises).then(function () {
                for (i in emotion_obj) {
                    obj.push({
                        emotion : i,
                        count : emotion_obj[i],
                        percentage: 100 * emotion_obj[i]/ reviews.length,
                    });
                }

                obj.sort(function (a, b) {
                    return b.count - a.count;
                });
                resolve(obj);
            }).catch(function (err) {
                reject(err);
            });
        });
    },

};