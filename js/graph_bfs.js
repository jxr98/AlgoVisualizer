//set up a svg
var width = 1200,
    height = 600;

var svg=d3.select('body')
    .append('svg')
    .attr('width',width)
    .attr('height',height);


function mouseDown() {
    var coordinates = d3.mouse(this);

    svg.append('circle')
    .attr('cx',coordinates[0])
    .attr('cy',coordinates[1])
    .attr('r',30)
    .attr('stroke','black')
    .attr('fill','#a1d99b')
    .attr('id',"c"+E)

    svg.append('text')
        .attr('x', coordinates[0])
        .attr('y', coordinates[1])
        .attr('stroke', 'black')
        .style("font-size",17 )
        .text(E);
    E++;
}

function restart(){
    initiateGraph();
    E=2;
    graph=null;
}

function clickOnStartButton(){
    graph=new Graph(E);

    //read edges from user input
    var edgeInput=$("#formControlTextarea1").val();
    var edges=edgeInput.split(/\n/);

    for(var i=0;i<edges.length;i++){
        var points=edges[i].split(" ");
        drawLinesBetweenCircles(points[0],points[1]);
    }

    var breadthFirstPaths=new BreadthFirstPaths(graph,0)
    var theLastPoint=E-1;
    var path= "From point 0 to point " + theLastPoint +  ": "
    if(!breadthFirstPaths.hasPathTo(theLastPoint)){
        window.alert("Point 0 and point "+ theLastPoint + " are not connected");
    }else{
        breadthFirstPaths.pathTo(theLastPoint).forEach(function(item){
            path +=" "+ item;
        });
        window.alert(path);
    }
}

function initiateGraph(){
    svg.append('circle')
        .attr('cx',300)
        .attr('cy',200)
        .attr('r',30)
        .attr('stroke','black')
        .attr('fill','#a1d99b')
        .attr('id',"c0");

    svg.append('text')
        .attr('x', 300)
        .attr('y', 200)
        .attr('stroke', 'black')
        .style("font-size", 17)
        .text(0)

    svg.append('circle')
        .attr('cx',1100)
        .attr('cy',200)
        .attr('r',30)
        .attr('stroke','black')
        .attr('fill','#a1d99b')
        .attr('id',"c1");

    svg.append('text')
        .attr('x', 1100)
        .attr('y', 200)
        .attr('stroke', 'black')
        .style("font-size", 17)
        .text(1)

}

//draw a line between nodeOne(int index) and nodeTwo(int index)
function drawLinesBetweenCircles(nodeOne,nodeTwo){
    graph.addEdge(nodeOne,nodeTwo);
    var x1=d3.select("#c"+nodeOne).attr("cx");
    var y1=d3.select("#c"+nodeOne).attr("cy");
    var x2=d3.select("#c"+nodeTwo).attr("cx");
    var y2=d3.select("#c"+nodeTwo).attr("cy");
    svg.append('line')
        .attr('x1',x1)
        .attr('y1',y1)
        .attr('x2',x2)
        .attr('y2',y2)
        .attr('stroke','#a1d99b');
}

var E=2//number of vertices
var graph;
initiateGraph();
svg.on('mousedown',mouseDown);
