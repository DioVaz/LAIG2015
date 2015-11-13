/**
 * LeafTerrain
 * @constructor
 * @param id of cylinder
 * @param texture of the terrain
 * @param heightMap map of heights for the terrain
 */
function LeafTerrain(id, texture, heightMap) {
    Leaf.call(this, id, "terrain");
	this.texture = texture;
	this.heightMap = heightMap;
}

LeafTerrain.prototype = Object.create(Leaf.prototype);
LeafTerrain.prototype.constructor = LeafTerrain;

