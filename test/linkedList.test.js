import {Node,LinkedList} from '../js/lib/linkedList'

test('crate a Node object',()=>{
    const node=new Node(1);
    expect(node.element).toBe(1);
    expect(node.next).toBe(null);
});

test('linkedlist1',()=>{
    var linkedList=new LinkedList();
    expect(linkedList.getSize()).toBe(0);
    expect(linkedList.getAtIndex(0)).toBe(null);
    expect(linkedList.isEmpty()).toBe(true);
    linkedList.addAtEnd(2);
    linkedList.addAtStart(1);
    linkedList.addAtEnd(3);
    expect(linkedList.getSize()).toBe(3);
    expect(linkedList.getAtIndex(0)).toBe(1);
    expect(linkedList.getAtIndex(1)).toBe(2);
    expect(linkedList.getAtIndex(2)).toBe(3);
});

test('linkedlist2',()=>{
    var linkedList=new LinkedList();
    linkedList.addAtStart(0);
    expect(linkedList.getAtIndex(0)).toBe(0);
});