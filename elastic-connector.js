/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var elasticsearch = require('elasticsearch');

module.exports.getNodes = function (index) {
    return new Promise(function (resolve, reject) {
        var client = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'error'
        });

        client.ping({
            // ping usually has e 3000ms timeout
            requestTimeout: 1000
        }, function (err) {
            if (err) {
                console.trace('elasticsearch cluster is down!');
                reject('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        });

        var graph_json = {
            nodes: [],
            links: []
        }

        client.search({
            index: index,
            type: 'tweet',
            body: {
                query: {
                    match_all: {}
                },
                sort : [
                    { "id" : {"order" : "asc"}, "time": {"order" : "asc"} },
                ],
            },
            size: 1000
        }).then(function (resp) {
            var hits = resp.hits;
            hits.hits.forEach(function (value, index) {
                var color = 'green';
                if (value._source.emotion == 'sad') {
                    color = 'blue';
                } else if (value._source.emotion == 'excited') {
                    color = 'yellow';
                } else if (value._source.emotion == 'fear') {
                    color = 'black';
                } else if (value._source.emotion == 'angry') {
                    color = 'red';
                }
                graph_json.nodes.push({
                    name: value._source.id.toString(),
                    color: color,
                    time: value._source.time,
                    title: value._source.text,
                    emotion: value._source.emotion,
                    sentiment: value._source.sentiment,
                    html: value._source.html,
                    id: value._source.id,
                    parent: value._source.parent,
                });

                graph_json.links.push({
                    source: value._source.parent,
                    target: value._source.id
                });

                // if (value._source.parent == 14) {
                //     console.log(graph_json.links);
                // }


                // function compare(a,b) {
                //     if (a.source < b.source)
                //         return -1;
                //     if (a.source > b.source)
                //         return 1;
                //     return 0;
                // }
                //
                // graph_json.links.sort(compare);
            });

            resolve(graph_json);
        }, function (err) {
            reject(err.message);
        });
    });
};
