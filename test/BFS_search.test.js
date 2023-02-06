import { BFS_search } from '../js/lib/BFS_search'
import { Graph } from '../js/lib/graph'

test('BFS on graph with 2 node, 1 edge', () => {
    let g = new Graph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    g.addEdge(nodeA, nodeB);
    // run search, check result
    let search = new BFS_search(g, nodeA);
    expect(search.hasPathTo(nodeB)).toBe(true);

    let path = search.pathTo(nodeB); // array or path from dst to src
    expect(path.length).toBe(2);
    expect(path[0]).toBe(nodeB);
    expect(path[1]).toBe(nodeA);
});