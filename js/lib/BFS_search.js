class BFS_search{
    #marked;// boolean[] is a shortest path to this vertex known
    #edgeTo;// int[] last vertex on known path to this vertex
    #sourcePoint; // the source point
    #visited; // record visited nodes in each step

    constructor(graph,s){
        this.#marked=new Array(graph.getNumVertices()).fill(false);
        this.#edgeTo=[];
        this.#sourcePoint=s;
        this.#visited=[];
        this.bfs(graph,s);
    }

    bfs(graph,s){
        var queue=[];
        this.#marked[s]=true;
        let self = this;
        queue.push(s);
        while(queue.length!=0){
            let size=queue.length;
            let sameStepVertices=[];
            for (let i = 0; i < size; i++) {
                let v=queue.shift();
                sameStepVertices.push(v);
                var adjacent=graph.getAdjacent(v);
                adjacent.forEach(function(value)
                {
                    if (!self.#marked[value]) {
                        self.#edgeTo[value] = v;
                        self.#marked[value] = true;
                        queue.push(value);
                    }
                });
            }
            this.#visited.push(sameStepVertices);
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
        let queueArr=[];// int[] of visited[][]
        for(var i=0;i<this.#visited.length;i++){
            for(var j=0;j<this.#visited[i].length;j++){
                queueArr.push(this.#visited[i][j]);
            }
        }
        return {"TwoDArray":this.#visited,"OneDArray":queueArr};
    }
}

export {BFS_search}