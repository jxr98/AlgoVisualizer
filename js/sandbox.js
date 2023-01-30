// NOTE: use v7 of D3 library

// setup svg
var width = 960,
    height = 500;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
let graph = {
    nodes: [],
    links: [],
}

// a message
let msg = "1) double click on a node to toggle color. 2) can drag node around. 3) two additional nodes are added & connected after a delay";
svg.append('text')
    .attr("class", "text")
    .attr("x", 20)
    .attr("y", 20)
    .text(msg);

// create a simulation
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
    .nodes(graph.nodes)
    .force("link", d3.forceLink(graph.links).distance(100))
    .on("tick", function () {
        svg.selectAll('.link')
            .attr("x1", function (d) { return d.source.x })
            .attr("y1", function (d) { return d.source.y })
            .attr("x2", function (d) { return d.target.x })
            .attr("y2", function (d) { return d.target.y })

        svg.selectAll('.node')
            .attr("cx", function (d) { return d.x })
            .attr("cy", function (d) { return d.y })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }).alphaDecay(0.002) // just added alpha decay to delay end of execution

function update() {
    // update links
    var link = svg.selectAll('.link').data(graph.links);
    link.enter()
        .insert('line', '.node')
        .attr('class', 'link')
        .style('stroke', '#d9d9d9');
    link
        .exit()
        .remove()

    // update nodes
    var node = svg.selectAll('.node').data(graph.nodes);
    var g = node.enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragging)
            .on('end', dragEnd));
    g.append('circle')
        .attr("r", 20)
        .style("fill", "#d9d9d9")
        .on("dblclick", function () {
            // on double click circle
            // toggle color between magenta and gray
            if (d3.select(this).style("fill") == "magenta") {
                d3.select(this).style("fill", "rgb(217, 217, 217)");
            } else {
                d3.select(this).style("fill", "magenta");
            }
        })
    g.append('text')
        .attr("class", "text")
        .text(function (d) { return d.name });
    node
        .exit()
        .remove();

    // update simulation
    simulation
        .nodes(graph.nodes)
        .force("link", d3.forceLink(graph.links).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .alpha(1) // need to reset alpha as well here
        .restart()
};

function addNode(node) {
    graph.nodes.push(node);
    update();
};

function connectNodes(source, target) {
    graph.links.push({
        source: source,
        target: target,
    });
    update();
};

addNode({
    id: "you",
    name: "you",
});

// dragging handles
function dragStart(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}
function dragging(event, d) {
    //simulation.alpha(1).restart();
    d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y)
        .attr("transform", "translate(" + d.x + "," + d.y + ")");
    // fix location to drag location, so forces are ignored (otherwise cause jittering)
    d.fx = event.x;
    d.fy = event.y;
}
function dragEnd(event, d) {
    d3.select(this).attr("stroke", null);
    // re-enable forces
    d.fx = null;
    d.fy = null;
    simulation.alpha(1).restart();
}

let index = 1;

// add a new node every three seconds and connect to 'you'
const interval = window.setInterval(() => {
    let id = Math.random().toString(36).replace('0.', '');
    id = id.slice(0, 4);
    addNode({
        id: id,
        name: id
    });

    connectNodes(0, index);
    index++;
}, 1000);

// no more than 8 nodes
setTimeout(() => {
    clearInterval(interval)
}, 1000 * 2);