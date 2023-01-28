//set up a svg
var width = 1200,
    height = 600,
    colors = d3.scale.category10();

var svg=d3.select('body')
    .append('svg')
    .attr('width',width)
    .attr('height',height);


function mousedown() {
    var coordinates = d3.mouse(this);

    svg.append('circle')
    .attr('cx',coordinates[0])
    .attr('cy',coordinates[1])
    .attr('r',30)
    .attr('stroke','black')
    .attr('fill','#a1d99b');
}

