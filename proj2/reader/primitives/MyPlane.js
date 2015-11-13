/**
 * MyPlane
 * @constructor
 * @param scene CGFscene
 * @param parts number of parts
 */
function MyPlane(scene, parts){
	var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1], [[[0,0,0],[1,0,0]], [[1,0,0], [1,0,1]]]);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, parts, parts);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}