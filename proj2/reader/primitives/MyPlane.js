/**
 * MyPlane
 * @constructor
 * @param scene CGFscene
 * @param parts number of parts
 */
function MyPlane(scene, parts){
	var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1], [[[0.5,0,-0.5,1],[0.5,0,0.5,1]], [[-0.5,0,-0.5,1], [-0.5,0,0.5,1]]]);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, parts, parts);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.scale(-1,1,1);
		this.scene.rotate(0,1,0,Math.PI);
		CGFnurbsObject.prototype.display.call(this);
	this.scene.popMatrix();
}

MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}
