import {PriorityQueue} from "./PriorityQueue.js";

export class PrimMST{
    #mst; // Queue<Edge>
    #marked; // boolean[]
    #pq; // Edge[]

    constructor(g) { // EdgeWeightedGraph
        this.#pq=[];
        this.#marked=[];
        this.#mst=[];

        this.#visit(g,0);
        while(this.#pq.length!==0){
            var e=this.#pq[0];
            this.#pq.splice(0, 1);
            var v=e.source;
            var w=e.other(v);
            if(this.#marked[v]&&this.#marked[w]){
                continue;
            }
            this.#mst.push(e);
            if(!this.#marked[v]){
                this.#visit(g,v);
            }
            if(!this.#marked[w]){
                this.#visit(g,w);
            }
        }
    }

    #visit(g, v){ // EdgeWeightedGraph, int
        this.#marked[v]=true;
        for(var it of g.getAdjacent(v)){
            if(!this.#marked[it.other(v)]){
                this.#pq.push(it);
                this.#pq.sort(function (a,b) {
                    return a.weight-b.weight;
                })
            }
        }
    }

    edges(){
        var ret=[];
        var length=this.#mst.length;
        for(var i=0;i<length;i++){
            var item=this.#mst[i];
            ret.push({
                source: item.source,
                target: item.target,
                weight: item.weight
            });
        }
        return ret;
    }

    weights(){
        var sum=0;
        while(this.#mst.length!==0){
            var item=this.#mst.shift();
            sum+=item.weight;
        }
        return sum;
    }

    checkGraphConnection(g){
        return g.getNumEdges()+1>=g.getNumVertices();
    }
}