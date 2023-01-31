import {Node,LinkedList} from '../js/lib/linkedList'

test('crate a Node object',()=>{
    const node=new Node(1);
    expect(node.element).toBe(1);
    expect(node.next).toBe(null);
});

test('linkedlist',()=>{
    var linkedList=new LinkedList();
    expect(linkedList.getSize()).toBe(0);
    expect(linkedList.getAtIndex(0)).toBe(null);
    expect(linkedList.isEmpty()).toBe(true);
    linkedList.addAtEnd(2);
    linkedList.addAtStart(1);
    expect(linkedList.getSize()).toBe(2);
    expect(linkedList.getAtIndex(0)).toBe(1);
    expect(linkedList.getAtIndex(1)).toBe(2);
});