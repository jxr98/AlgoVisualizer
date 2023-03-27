import {GraphDecorator} from "./GraphDecorator.js";

export class EdgeWeightedGraph extends GraphDecorator{
    constructor(graph) {
        super(graph);
    }

    addNode(x = 0, y = 0) {}
    addEdge(v,w){}
    checkConnection(v,w){}

}