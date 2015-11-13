/**
 * LeafPlane
 * @constructor
 * @param id of plane
 * @param parts number of parts
 */
function LeafPlane(id, parts) {
    Leaf.call(this, id, "plane");
    this.parts = parts;
}

LeafPlane.prototype = Object.create(Leaf.prototype);
LeafPlane.prototype.constructor = LeafPlane;
