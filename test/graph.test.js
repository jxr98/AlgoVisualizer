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
    expect(g.getAdjacent(nodeA).getAtIndex(0)).toBe(nodeB);
    expect(g.getAdjacent(nodeB).getAtIndex(0)).toBe(nodeA);
});