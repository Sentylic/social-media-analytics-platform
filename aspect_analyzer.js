/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');

module.exports = {

    findAspects: function () {
        return new Promise(function (resolve, reject) {
            var obj = [
                {
                    aspect : 'food',
                    percentage : 50
                },
                {
                    aspect : 'service',
                    percentage : 22
                },
                {
                    aspect : 'drinks',
                    percentage : 12
                }
            ];

            resolve(obj);
        });
    },

};