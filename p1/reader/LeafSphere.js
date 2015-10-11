function LeafSphere(id, radius, stacks, sections) {
    Leaf.call(this, id, "sphere");
    this.radius = radius;
    this.stacks = stacks;
    this.sections = sections;
}

LeafSphere.prototype = Object.create(LeafSphere.prototype);
LeafSphere.prototype.constructor = LeafSphere;