/**
 * Leaf
 * @constructor
 * @param id of leaf
 * @param type of leaf
 */
function Leaf(id, type) {
    this.id = id;
    this.type = type;
}

Leaf.prototype = Object.create(Object.prototype);
Leaf.prototype.constructor = Leaf;