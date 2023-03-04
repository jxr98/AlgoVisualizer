import { DFS } from '../js/lib/DFS'
import { Graph } from '../js/lib/graph'

test('DFS on graph with 2 node, 1 edge', () => {
    let g = new Graph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    g.addEdge(nodeA, nodeB);
    // run search, check result
    let search = new DFS(g, nodeA, nodeB);
    expect(search.havePath()).toBe(true);

    let path = search.getPath(); // array or path from dst to src
    console.log(path)
    expect(path.length).toBe(2);
    expect(path[0]).toBe(nodeA);
    expect(path[1]).toBe(nodeB);
    expect(search.getProcess()).toMatchObject([0,1,1,0]);
});

test('DFS, no path found', () => {
    let g = new Graph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    let nodeC = g.addNode();
    g.addEdge(nodeA, nodeB);
    // run search, check result
    let search = new DFS(g, nodeA, nodeC);
    expect(search.havePath()).toBe(false);
});