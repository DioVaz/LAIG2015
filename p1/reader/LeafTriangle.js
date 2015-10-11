function LeafTriangle(id, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
    Leaf.call(this, id, "triangle");
    this.v1 = vec3.fromValues(v1x, v1y, v1z);
    this.v2 = vec3.fromValues(v2x, v2y, v2z);
    this.v3 = vec3.fromValues(v3x, v3y, v3z);
}

LeafTriangle.prototype = Object.create(LeafTriangle.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;
