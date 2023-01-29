class BreadthFirstPaths{
    #marked;// boolean[] is a shortest path to this vertex known
    #edgeTo;// int[] last vertex on known path to this vertex
    #sourcePoint; // the source point

    constructor(graph,s){
        this.#marked=new Array(graph.getV()).fill(false);
        this.#edgeTo=[];
        this.#sourcePoint=s;
        this.bfs(graph,s);
    }

    bfs(graph,s){
        var queue=[];
        this.#marked[s]=true;
        queue.push(s);
        while(queue.length!=0){
            let v=queue.shift();
            var adjacent=graph.getAdjacent(v);
            for(let i=0;i<adjacent.getSize();i++){
                var w=adjacent.getAtIndex(i);
                if(!this.#marked[w]){
                    this.#edgeTo[w]=v;
                    this.#marked[w]=true;
                    queue.push(w);
                }
            }
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
}
class Graph{
    #V; // number of vertices
    #E; // number of edges
    #adjacent; // adjacent

    constructor(V){
        this.#V=V;
        this.#E=0;
        this.#adjacent=[];
        for(let v=0;v<V;v++){
            this.#adjacent[v]=new LinkedList();
        }
    }

    getV(){
        return this.#V;
    }

    getE(){
        return this.#E;
    }

    addEdge(v,w){
        this.#adjacent[v].addAtStart(w);
        this.#adjacent[w].addAtStart(v);
        this.#E++;
    }

    //get adjacent list of point v
    getAdjacent(v){
        return this.#adjacent[v];
    }
}