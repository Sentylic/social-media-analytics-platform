function populateNodes(drawGraph) {

    var indexName = "tweets"
    var host = "localhost";
    var port = 9200;

    var data = {};

    var graph_json = {
        nodes: [],
        links: []
    }

    $.ajax({
        type: "POST",
        url: 'http://' + host + ':' + port + '/' + indexName + '/_search?size=500',
        data: data,
        success: function (data) {
            // data = JSON.parse(data);
            console.log(data.hits.total);
            $.each(data.hits.hits, function (index, value) {
                //     // console.log(value._source.parent);
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
                    title: "title",
                    emotion: value._source.emotion,
                    sentiment: value._source.sentiment,
                });
                graph_json.links.push({
                    source: value._source.parent,
                    target: value._source.id
                });
            });

            // console.log(graph_json);
            drawGraph(graph_json);
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error : ' + errorThrown);
        }
    });

}