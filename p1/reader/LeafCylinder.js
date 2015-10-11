function LeafCylinder(id, height, bottomRadius, topRadius, sections, parts) {
    Leaf.call(this, id, "cylinder");
    this.height = height;
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.sections = sections;
    this.parts = parts;
}

LeafCylinder.prototype = Object.create(LeafCylinder.prototype);
LeafCylinder.prototype.constructor = LeafCylinder;