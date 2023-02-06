import { Graph } from '../js/lib/graph'

test('default graph', () => {
    let g = new Graph();
    expect(g.getNumVertices()).toBe(0);
    expect(g.getNumEdges()).toBe(0);
});

test('graph with 2 node, 1 edge', () => {
    let g = new Graph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    g.addEdge(nodeA, nodeB);
    expect(g.getNumVertices()).toBe(2);
    expect(g.getNumEdges()).toBe(1);
    // expect(g.getAdjacent(nodeA).getAtIndex(0)).toBe(nodeB);
    // expect(g.getAdjacent(nodeB).getAtIndex(0)).toBe(nodeA);
});

test('graph link with 2 node, 1 edge', () => {
    let g = new Graph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    g.addEdge(nodeA, nodeB);
    let links = g.getLinks();
    expect(links.length).toBe(1);
});

test('graph node property', () => {
    let g = new Graph();
    let nodeX = 1;
    let nodeY = 2;
    let nodeA = g.addNode(nodeX, nodeY);
    expect(g.getNumVertices()).toBe(1);
    expect(g.getLinks().length).toBe(0);
    expect(g.getNodes().length).toBe(1);
    g.updateNodeProp(nodeA, {color: "red"});
    let nodeProp = g.getNodes()[0];
    expect(nodeProp.x).toBe(nodeX);
    expect(nodeProp.y).toBe(nodeY);
    expect(nodeProp.color).toBe("red");
});