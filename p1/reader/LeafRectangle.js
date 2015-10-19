/**
 * LeafRectangle
 * @constructor
 * @param id of rectangle
 * @param x0 x-coord of first vertice
 * @param y0 y-coord of first vertice
 * @param x1 x-coord of second vertice
 * @param y1 y-coord of second vertice
 */
function LeafRectangle(id, x0, y0, x1, y1) {
    Leaf.call(this, id, "rectangle");
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
}

Leaf.prototype = Object.create(Leaf.prototype);
LeafRectangle.prototype.constructor = LeafRectangle;