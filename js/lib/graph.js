class Graph{
    #numVertices;
    #numEdges;
    #adjacent; // adjacency list
    #nodeProp;

    constructor(){
        this.#numVertices=0;
        this.#numEdges=0;
        this.#adjacent=[];
        this.#nodeProp=[];
    }

    getNumVertices(){ return this.#numVertices; }
    getNumEdges(){ return this.#numEdges; }
   
    // create a new node, return index of new node
    addNode(x = 0, y = 0) {
        const newNodeIndex = this.#numVertices++;
        this.#adjacent[newNodeIndex]=new Set();
        this.#nodeProp[newNodeIndex]={x:x, y:y};
        return newNodeIndex;
    }
    addEdge(v,w) {
        this.#adjacent[v].add(w);
        this.#adjacent[w].add(v);
        this.#numEdges++;
    }
    updateNodeProp(node, prop)
    {
        this.#nodeProp[node]= Object.assign(this.#nodeProp[node], prop);
    }

    //get neibours of v (returns a set)
    getAdjacent(v){
        return this.#adjacent[v];
    }

    // this interface is designed for D3.force simulation
    getNodes()
    {
        let ret = [];
        for (let i = 0; i < this.#numVertices; i++) 
        {
            ret[i] = {
                id: i,
                name: i,
                x: this.#nodeProp[i].x,
                y: this.#nodeProp[i].y
            };
            // other props are merged
            ret[i] = Object.assign(ret[i], this.#nodeProp[i]);
        }
        return ret;
    }
    // this interface is designed for D3.force simulation
    getLinks()
    {
        const lookup = new Map();
        let ret = [];
        for (let i = 0; i < this.#numVertices; i++) 
        {
            if (!lookup.has(i))
            {
                lookup.set(i, new Set());
            }

            // check links for node i
            var adjacent=this.#adjacent[i];
            adjacent.forEach(function (value) {
                var w = value;

                // if a link already exist, continue
                // this check here make sure that we dont have 2 links for each edge
                if (!lookup.get(i).has(w))
                {
                    // since we are doing bi-directional links, add for both direction
                    lookup.get(i).add(w);
                    if (!lookup.has(w))
                    {
                        lookup.set(w, new Set());
                    }
                    lookup.get(w).add(i);
                    ret.push({
                        source: i,
                        target: parseInt(w)
                    });
                }
                
            });
        }
        return ret;
    }
}

export {Graph}