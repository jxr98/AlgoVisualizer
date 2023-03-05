class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor()
    {
        this.items = [];
    }
    // in ascending order and dequeue the min. item
    enqueue(element, priority)
    {
        // creating object from queue element
        let qElement = new QElement(element, priority);
        let contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift().element;
    }

    // update an exist qElement with element and new priority
    update(element, priority)
    {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].element == element) {
                this.items.splice(i, 1);
                this.enqueue(element, priority);
                break;
            }
        }
    }

    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }
}

export{PriorityQueue}