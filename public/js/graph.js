/**
 * Created by chamod on 4/29/18.
 */

var width = 1500,
    height = 1000,
    radius = 10,
    padding = 50;

var fill = d3.scale.category10();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#bodyContent").append("svg")
    .attr("width", width)
    .attr("height", height);

var xScale;

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

$(function () {

//.......................
    $.getJSON("../json/graph.json", function (json) {
        console.log(json);
        drawDiagram(json);
    });
});

function drawDiagram(json) {
    drawTimeAxis(json.nodes);
    drawGraph(json)
}

function drawTimeAxis(nodes) {
    // define the x scale (horizontal)
    var mindate = new Date(d3.min(nodes, function (d) {
            return d.time;
        })),
        maxdate = new Date(d3.max(nodes, function (d) {
            return d.time;
        }));

    xScale = d3.time.scale()
        .domain([mindate, maxdate])
        .range([padding, width - padding * 2]);   // map these the the chart width = total width minus padding at both sides

    // define the x axis
    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

    // draw x axis with labels and move to the bottom of the chart area
    svg.append("g")
        .attr("class", "xaxis")   // give it e class so it can be used to select only xaxis labels  below
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // now rotate text on x axis
    // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
    // first move the text left so no longer centered on the tick
    // then rotate up to get 45 degrees.
    svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
        .attr("transform", function (d) {
            return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-15)";
        });
}

function drawGraph(json) {
    // d3.json("graph.json", function (error, json) {
    //     if (error) throw error;
    var link = svg.selectAll("line")
        .data(json.links)
        .enter().append("line")
        .attr({"marker-end": "url(#" + Math.round(Math.random()) + ")"})
    ;

    var node = svg.selectAll("circle")
        .data(json.nodes)
        .enter().append("circle")
        .attr("r", radius - .75)
        .style("fill", function (d) {
            return fill(d.color);
        })
        .style("stroke", function (d) {
            return d3.rgb(fill(d.group)).darker();
        })
        .call(force.drag)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(
                "Title : " + d.title + "<br/>" +
                "Time : " + d.time + "<br/>" +
                "Emotion : " + d.emotion + "<br/>" +
                "Sentiment : " + d.sentiment + "<br/>"
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (d) {
            window.location.href = window.location.href + "/topic/dummyTopic";
        })
    ;

    force
        .nodes(json.nodes)
        .links(json.links)
        .on("tick", tick)
        .start();

    function tick(e) {
        var k = 6 * e.alpha;

        // Push sources up and targets down to form e weak tree.
        link
            .each(function (d) {
                d.source.x -= k, d.target.x += k;
            })
            .attr("x1", function (d) {
                return xScale(d.source.time);
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return xScale(d.target.time);
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return xScale(d.time);
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }
}