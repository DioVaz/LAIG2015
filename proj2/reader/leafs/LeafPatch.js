/**
 * LeafPatch
 * @constructor
 * @param id of cylinder
 * @param h height of the cylinder
 * @param bottomR radius of bottom
 * @param topR radius of top
 * @param sections number of sections
 * @param parts number of parts
 */
function LeafPatch(id, degree, partsU, partsV, controlPoints) {
    Leaf.call(this, id, "patch");
    this.id = id;
    this.degree = degree;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlPoints = controlPoints;

}

LeafPatch.prototype = Object.create(Leaf.prototype);
LeafPatch.prototype.constructor = LeafPatch;