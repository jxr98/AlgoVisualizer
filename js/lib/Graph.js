export class Graph{

    #numVertices;
    #numEdges;
 
    constructor() {
        this.#numVertices=0;
        this.#numEdges=0;
    }

    addNode(x = 0, y = 0) {}
    addEdge(v,w){}
    checkConnection(v,w){}
}