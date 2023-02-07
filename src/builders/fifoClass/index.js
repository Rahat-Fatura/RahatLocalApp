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
        try {
            if (this.getLength() != this.length) throw new Error("not equal");
            for await (let element of this.elements) {
                if (!isEqual(this.elements[0], element))
                    throw new Error("not equal");
            }
            return true;
        } catch (error) {
            console.log("error :>> ", error);
            return false;
        }
    }
}

module.exports = { Queue };
