import {Graph} from "./Graph.js";

export class GraphDecorator extends Graph{

    graph; // type Graph
    constructor(graph) {
        super();
        this.graph=graph;
    }
    addNode(x = 0, y = 0) {
        this.graph.addNode(x = 0, y = 0);
    }
    addEdge(v,w){
        this.graph.addEdge(v,w);
    }
    checkConnection(v,w){
        this.graph.checkConnection(v,w);
    }
}