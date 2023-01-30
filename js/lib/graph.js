class BreadthFirstPaths{
    #marked;// boolean[] is a shortest path to this vertex known
    #edgeTo;// int[] last vertex on known path to this vertex
    #sourcePoint; // the source point
    #visited; // record visited nodes in each step

    constructor(graph,s){
        this.#marked=new Array(graph.getNumVertices()).fill(false);
        this.#edgeTo=[];
        this.#sourcePoint=s;
        this.#visited=new LinkedList();
        this.bfs(graph,s);
    }

    bfs(graph,s){
        var queue=[];
        this.#marked[s]=true;
        queue.push(s);
        while(queue.length!=0){
            let size=queue.length;
            let sameStepVertices=[];
            for (let i = 0; i < size; i++) {
                let v=queue.shift();
                sameStepVertices.push(v);
                var adjacent=graph.getAdjacent(v);
                for(let i=0;i<adjacent.getSize();i++) {
                    var w = adjacent.getAtIndex(i);
                    if (!this.#marked[w]) {
                        this.#edgeTo[w] = v;
                        this.#marked[w] = true;
                        queue.push(w);
                    }
                }
            }
            this.#visited.addAtEnd(sameStepVertices);
        }
    }

    // check if there is a path from sourcePoint to v
    hasPathTo(v){
        return this.#marked[v];
    }

    // return an array to represent the shortest path from sourcePoint to v
    pathTo(v){
        //return null if v is not connected to sourcePoint
        if(!this.hasPathTo(v)){
            return null;
        }
        var path=[];
        for(let i=v;i!=this.#sourcePoint;i=this.#edgeTo[i]){
            path.push(i);
        }
        path.push(this.#sourcePoint);
        return path;
    }

    getProcess() {
        return this.#visited;
    }
}

class Graph{
    #numVertices;
    #numEdges;
    #adjacent; // adjacency list

    constructor(){
        this.#numVertices=0;
        this.#numEdges=0;
        this.#adjacent=[];
    }

    getNumVertices(){ return this.#numVertices; }
    getNumEdges(){ return this.#numEdges; }
   
    // create a new node, return index of new node
    addNode() {
        const newNodeIndex = this.#numVertices++;
        this.#adjacent[newNodeIndex]=new LinkedList();
        console.log(newNodeIndex);
        return newNodeIndex;
    }

    addEdge(v,w) {
        // what happens if edge already exist? should we use a set instead of list?
        this.#adjacent[v].addAtStart(w);
        this.#adjacent[w].addAtStart(v);
        this.#numEdges++;
    }

    //get neibours of v
    getAdjacent(v){
        return this.#adjacent[v];
    }
}