import {Graph} from "./Graph.js";

export class UndirectedGraph extends Graph{
    #numVertices;
    #numEdges;
    #adjacent; // adjacency list, array of sets
    #nodeProp; // array of objects

    constructor(){
        super();
        this.#numVertices=0;
        this.#numEdges=0;
        this.#adjacent=[];
        this.#nodeProp=[];
    }

    getNumVertices(){ return this.#numVertices; }
    getNumEdges(){ return this.#numEdges; }

    deleteNode(node)
    {
        // lazy delete
        this.updateNodeProp(node, {delete : true})

        // remove edge to this node from all other nodes
        for (let i = 0; i < this.#numVertices; i++)
        {
            let deleted = this.#adjacent[i].delete(node.toString())
            if (deleted)
            {
                this.#numEdges--;
            }
        }


        // cannot decrement this.#numVertices that is used to traverse all nodes
        // decrementing it in a lazy delete means there will be missed nodes
    }

    removeEdge(a,b)
    {
        let removeB = this.#adjacent[a].delete(b.toString());
        let removeA = this.#adjacent[b].delete(a.toString());
        this.#numEdges--;
    }
   
    // create a new node, return index of new node
    addNode(x = 0, y = 0) {
        const newNodeIndex = this.#numVertices++;
        this.#adjacent[newNodeIndex]=new Set();
        this.#nodeProp[newNodeIndex]={x:x, y:y, delete : false};
        return newNodeIndex;
    }
    addEdge(v,w) {
        this.#adjacent[v].add(w);
        this.#adjacent[w].add(v);
        this.#numEdges++;
    }
    // check connection between two nodes
    checkConnection(v,w){
        let connection1=this.getAdjacent(v);
        if(connection1!== undefined){
            for(var it of connection1){
                if(it==w){
                    return 1;
                }
            }
        }
        let connection2=this.getAdjacent(w);
        if(connection2!== undefined){
            for(var it of connection2){
                if(it==v){
                    return 1;
                }
            }
        }
        return 0;
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
            if (this.#nodeProp[i].delete === true) continue;

            let idx = ret.length;
            ret.push({
                id: i,
                name: i,
                x: this.#nodeProp[i].x,
                y: this.#nodeProp[i].y
            })

            // other props are merged
            ret[idx] = Object.assign(ret[idx], this.#nodeProp[i]);
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

            // if node i is deleted, skip
            if (this.#nodeProp[i].delete === true) continue;

            // check links for node i
            var adjacent=this.#adjacent[i];
            adjacent.forEach(function (value) {
                let neighborNode = parseInt(value);

                // if a link already exist, continue
                // this check here make sure that we dont have 2 links for each edge
                if (!lookup.get(i).has(neighborNode))
                {
                    // since we are doing bi-directional links, add for both direction
                    lookup.get(i).add(neighborNode);
                    if (!lookup.has(neighborNode))
                    {
                        lookup.set(neighborNode, new Set());
                    }
                    lookup.get(neighborNode).add(i);
                    ret.push({
                        source: i,
                        target: neighborNode
                    });
                }
                
            });
        }
        return ret;
    }
}