/**
 * LeafVehicle
 * @constructor
 * @param id of cylinder
 * @param h height of the cylinder
 * @param bottomR radius of bottom
 * @param topR radius of top
 * @param sections number of sections
 * @param parts number of parts
 */
function LeafVehicle(id, h, bottomR, topR, sections, parts) {
    Leaf.call(this, id, "vehicle");
    this.height = h;
    this.bottomRadius = bottomR;
    this.topRadius = topR;
    this.sections = sections;
    this.parts = parts;
}

LeafVehicle.prototype = Object.create(Leaf.prototype);
LeafVehicle.prototype.constructor = LeafVehicle;