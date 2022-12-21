const isEqual = require("lodash/isEqual");

class Queue {
    constructor(length) {
        this.elements = [];
        this.length = length;
    }
    push(object) {
        if (this.getLength() == this.length) {
            this.shift();
        }
        return this.elements.push(object);
    }
    shift() {
        return this.elements.shift();
    }
    getLength() {
        return this.elements.length;
    }
    async isValid() {
        if (this.getLength() != this.length) return false;
        if (!isEqual(this.elements[0], this.elements[1])) return false;
        if (!isEqual(this.elements[0], this.elements[2])) return false;
        if (!isEqual(this.elements[1], this.elements[2])) return false;
        return true;
    }
}

module.exports = { Queue };
