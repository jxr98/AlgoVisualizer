import {createDefaultGraph} from "../js/lib/Graph";
import { UndirectedGraph}  from "../js/lib/UndirectedGraph";

test('create default graph', ()=>
{
    let g = new UndirectedGraph()
    createDefaultGraph(g)
    expect(g.getNumVertices()).toBe(6)
    expect(g.getNumEdges()).toBe(6)
})