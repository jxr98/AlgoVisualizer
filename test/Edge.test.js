import {Edge} from '../js/lib/Edge'

test('unweighted edge', ()=>{
    let e = Edge.UnweightedEdge(0, 1)
    expect(e.weight).toBe(0);
})