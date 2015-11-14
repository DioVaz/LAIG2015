/**
 * MyPatch
 * @constructor
 * @param scene CGFscene
 * @param parts number of parts
 */
function MyPatch(scene, order ,partsU, partsV, controlPoints){
	
	if(order == 1){
		knots = [0, 0, 1, 1];
	}else if(order == 2){
		knots = [0, 0, 0, 1, 1, 1];
	}else if(order == 3){
		knots = [0, 0, 0, 0, 1, 1, 1, 1];
	}else{
		console.error("Wrong order of Pacth");
		return;
	}
	
	var nurbsSurface = new CGFnurbsSurface(order, order, knots, knots, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, partsU, partsV);
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.scaleTexCoords = function(ampS, ampT) {}