class Node {
    constructor(element) {
        this.element = element;
        this.next = null
    }
}
// linkedlist class
class LinkedList {
    #head;
    #size;
    constructor() {
        this.#head = null;
        this.#size = 0;
    }

    // adds an element at the end
    // of list
    addAtEnd(element) {
        var node = new Node(element);

        // to store current node
        var current;

        // if list is Empty add the
        // element and make it head
        if (this.#head == null)
            this.#head = node;
        else {
            current = this.#head;

            // iterate to the end of the
            // list
            while (current.next) {
                current = current.next;
            }

            // add node
            current.next = node;
        }
        this.#size++;
    }
    // adds an element at the start
    // of list
    addAtStart(element) {
        var node = new Node(element);
        if (this.#head == null) {
            this.#head = node;
        } else {
            node.next = this.#head;
            this.#head = node;
        }
        this.#size++;
    }

    getAtIndex(i){
        if(i>this.#size-1){
            return null;
        }
        var item=this.#head;
        if(i==0){
            return item.element;
        }
        for(var j=1;j<=i;j++){
            item=item.next;
        }
        return item.element;
    }

    // checks the list for empty
    isEmpty() {
        return this.#size == 0;
    }

    // gives the size of the list
    getSize() {
        return this.#size;
    }
}
