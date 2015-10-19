/**
 * LeafRectangle
 * @constructor
 * @param id of sphere
 * @param radius of sphere
 * @param stacks number of stacks
 * @param sections number of sections
 */
function LeafSphere(id, radius, stacks, sections) {
    Leaf.call(this, id, "sphere");
    this.radius = radius;
    this.stacks = stacks;
    this.sections = sections;
}

LeafSphere.prototype = Object.create(Leaf.prototype);
LeafSphere.prototype.constructor = LeafSphere;