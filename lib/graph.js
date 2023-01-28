class BreadthFirstPaths{
    #marked;// boolean[] is a shortest path to this vertex known
    #edgeTo;// int[] last vertex on known path to this vertex
    #sourcePoint; // the source point

    constructor(graph,s){
        this.#marked=[];
        for(let i=0;i<graph.v;i++){
            this.#marked.push(false);
        }
        this.#edgeTo=[];
        this.#sourcePoint=s;
        this.bfs(graph,s);
    }

    bfs(graph,s){
        
    }
}
class Graph{

}