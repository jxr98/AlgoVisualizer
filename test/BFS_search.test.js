import { BFS_search } from '../js/lib/BFS_search'
import { UndirectedGraph } from '../js/lib/UndirectedGraph.js'

test('BFS on graph with 2 nodes, 1 edge', () => {
    let g = new UndirectedGraph();
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

    //test getProcess function
    let queue=[],
        visited=[];
    let visited0=[],
        visited1=[];
    visited0.push(0);
    visited1.push(1);
    visited.push(visited0,visited1);
    queue.push(0,1);
    expect(search.getProcess()).toMatchObject({"OneDArray":queue,"TwoDArray":visited});
});

test('BFS search grach with 2 nodes, 0 edge',()=>{
    let g = new UndirectedGraph();
    let nodeA = g.addNode();
    let nodeB = g.addNode();
    let search = new BFS_search(g, nodeA);
    expect(search.pathTo(nodeB)).toBe(null);
})