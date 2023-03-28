export class Edge{
    source; // int
    target; // int
    weight; // int
    constructor(source,target,weight) {
        this.source=source;
        this.target=target;
        this.weight=weight;
    }
    static UnweightedEdge(source,target){
        return new Edge(source,target,0);
    }

    // this function returns the other node of the edge
    other(v){
        if(v===this.source){
            return this.target;
        }else if(v===this.target){
            return this.source;
        }
    }
}