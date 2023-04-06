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

    deleteNode(_node)
    {
        if (!Number.isInteger(_node))
        {
            console.error("[UndirectedGraph::deleteNode] Parameter is not a number")
            return;
        }
        let node = parseInt(_node);
        if (isNaN(node))
        {
            console.error("[UndirectedGraph::deleteNode] node ID is invalid")
            return;
        }

        // lazy delete
        this.updateNodeProp(node, {delete : true})

        // remove edge to this node from all other nodes
        for (let i = 0; i < this.#numVertices; i++)
        {
            let deleted = this.#adjacent[i].delete(node)
            if (deleted)
            {
                this.#numEdges--;
            }
        }


        // cannot decrement this.#numVertices that is used to traverse all nodes
        // decrementing it in a lazy delete means there will be missed nodes
    }

    removeEdge(_a,_b)
    {
        if (!Number.isInteger(_a) || !Number.isInteger(_b))
        {
            /* istanbul ignore next */
            console.warn("[UndirectedGraph::removeEdge] Parameter is not a number")
        }

        let a = parseInt(_a),
        b = parseInt(_b)
        if (isNaN(a) || isNaN(b))
        {
            console.error("[UndirectedGraph::removeEdge] Parameter is invalid")
            return
        }

        let removeB = this.#adjacent[a].delete(b);
        let removeA = this.#adjacent[b].delete(a);
        if (removeB && removeA) this.#numEdges--;
        
    }
   
    // create a new node, return index of new node
    addNode(x = 0, y = 0) {
        const newNodeIndex = this.#numVertices++;
        this.#adjacent[newNodeIndex]=new Set();
        this.#nodeProp[newNodeIndex]={x:x, y:y, delete : false};
        return newNodeIndex;
    }
    addEdge(_v, _w) {
        if (!Number.isInteger(_w) || !Number.isInteger(_v))
        {
            /* istanbul ignore next */
            console.warn("[UndirectedGraph::addEdge] Parameter is not a number")
        }
        let v = parseInt(_v),
        w = parseInt(_w)
        if (isNaN(v) || isNaN(w))
        {
            console.error("[UndirectedGraph::addEdge] Parameter is invalid")
            return
        }

        this.#adjacent[v].add(w);
        this.#adjacent[w].add(v);
        this.#numEdges++;
    }
    // check connection between two nodes
    checkConnection(_v,_w){

        if (!Number.isInteger(_w) || !Number.isInteger(_v))
        {
            /* istanbul ignore next */
            console.warn("[UndirectedGraph::checkConnection] Parameter is not a number")
        }

        let v = parseInt(_v),
        w = parseInt(_w)
        if (isNaN(v) || isNaN(w))
        {
            console.error("[UndirectedGraph::checkConnection] Parameter is invalid")
            return
        }

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
        if (!Number.isInteger(node))
        {
            /* istanbul ignore next */
            console.warn("[UndirectedGraph::updateNodeProp] Parameter is not a number")
        }

        if (! (typeof prop === 'object' && prop !== null))
        {
            console.error("[UndirectedGraph::updateNodeProp] property is not a valid object")
            return;
        }
        
        let id = parseInt(node);
        if (isNaN(id))
        {
            console.error("[UndirectedGraph::updateNodeProp] node ID is invalid")
            return;
        }

        this.#nodeProp[id]= Object.assign(this.#nodeProp[id], prop);
    }

    //get neibours of v (returns a set)
    getAdjacent(v){
        if (!Number.isInteger(v))
        {
            /* istanbul ignore next */
            console.warn("[UndirectedGraph::getAdjacent] Parameter is not a number")
        }
        let id = parseInt(v);
        if (isNaN(id))
        {
            console.error("[UndirectedGraph::getAdjacent] node ID is invalid")
            return;
        }
        return this.#adjacent[parseInt(id)];
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

    getNodeProperty(index){
        return this.#nodeProp[index];
    }
}