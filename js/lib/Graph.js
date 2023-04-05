export class Graph{

    #numVertices;
    #numEdges;
 
    constructor() {
        this.#numVertices=0;
        this.#numEdges=0;
    }

    /* istanbul ignore next */
    addNode(x = 0, y = 0) {}
    /* istanbul ignore next */
    addEdge(v,w){}
    /* istanbul ignore next */
    checkConnection(v,w){}
}

export function createDefaultGraph(graph)
{
    let a = graph.addNode(0,0),
    b = graph.addNode(0,0),
    c = graph.addNode(0,0),
    d = graph.addNode(0,0),
    e = graph.addNode(0,0),
    f = graph.addNode(0,0)
    graph.addEdge(a,b)
    graph.addEdge(a,c)
    graph.addEdge(b,d)
    graph.addEdge(c,e)
    graph.addEdge(d,f)
    graph.addEdge(e,f)
}