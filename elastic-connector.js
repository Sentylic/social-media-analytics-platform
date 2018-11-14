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
                sort: [
                    {"time": {"order": "asc"}},
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
                    strTime: new Date(value._source.time * 1e3).toISOString(),
                    title: value._source.text,
                    emotion: value._source.emotion,
                    sentiment: value._source.sentiment,
                    html: value._source.html,
                    node_id: value._source.id,
                    parent: value._source.parent,
                });


                // if (value._source.parent == 14) {
                //     console.log(graph_json.links);
                // }
            });

            for (var n=0 ; n < graph_json.nodes.length; n++) {
                for (var p=0 ; p < graph_json.nodes.length;p++ ) {
                    if (graph_json.nodes[n].parent === graph_json.nodes[p].node_id) {
                        graph_json.links.push({
                            source: p,
                            target: n,
                        });
                        break;
                    }
                }
            }



            function compared(a,b) {
                if (a.target < b.target)
                    return -1;
                if (a.target > b.target)
                    return 1;
                return 0;
            }

            graph_json.links = graph_json.links.sort(compared);

            // console.log(graph_json.links);
            // console.log(graph_json.links.length);

            resolve(graph_json);
        }, function (err) {
            reject(err.message);
        });
    });
};
