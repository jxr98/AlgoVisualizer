import {PrimMST} from '../js/lib/PrimMST'
import {EdgeWeightedGraph} from "../js/lib/EdgeWeightedGraph.js";
import {Graph} from "../js/lib/Graph.js";
import {Edge} from "../js/lib/Edge.js";

test('simple case with 6 nodes',()=>{
    var g1=new EdgeWeightedGraph(new Graph());
    for(var i=0;i<6;i++){
        g1.addNode();
    }
    g1.addEdge(new Edge(4,0,1));
    g1.addEdge(new Edge(4,2,5));
    g1.addEdge(new Edge(0,2,9));
    g1.addEdge(new Edge(0,1,8));
    g1.addEdge(new Edge(0,3,4));
    g1.addEdge(new Edge(2,3,2));
    g1.addEdge(new Edge(1,3,3));
    g1.addEdge(new Edge(1,5,2));
    g1.addEdge(new Edge(3,5,10));
    var primMst=new PrimMST(g1);
    var t=primMst.edges();
    expect(primMst.checkGraphConnection(g1)).toBe(true);
    expect(primMst.weights()).toBe(12);
})