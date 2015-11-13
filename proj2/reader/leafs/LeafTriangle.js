/**
 * LeafTriangle
 * @constructor
 * @param id of rectangle
 * @param x0 x-coord of first vertice
 * @param y0 y-coord of first vertice
 * @param z0 z-coord of first vertice
 * @param x1 x-coord of second vertice
 * @param y1 y-coord of second vertice
 * @param z1 y-coord of second vertice
 * @param x2 x-coord of third vertice
 * @param y2 y-coord of third vertice
 * @param z2 z-coord of third vertice
 */
function LeafTriangle(id, x0, y0, z0, x1, y1, z1, x2, y2, z2) {
    Leaf.call(this, id, "triangle");
    this.v1 = vec3.fromValues(x0, y0, z0);
    this.v2 = vec3.fromValues(x1, y1, z1);
    this.v3 = vec3.fromValues(x2, y2, z2);
}

LeafTriangle.prototype = Object.create(Leaf.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;