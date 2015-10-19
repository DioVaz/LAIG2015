function MyCylinder(scene, height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.height = height;

	this.slices=slices;
	this.stacks=stacks;

	this.bRadius = bRadius;
	this.tRadius = tRadius;

 	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    var dTheta = 2*Math.PI/this.slices;
	var dRadius = (this.tRadius - this.bRadius) / this.stacks;
	var dHeight = this.height / this.stacks;

	this.vertices=[];
 	this.normals=[];
	this.texCoords=[];

	var vecNormal = vec3.create();

 	for (var stack = 0; stack <= this.stacks; ++stack) {
 		var radius = this.bRadius + dRadius * stack;
 		var height = dHeight * stack;
 		for (var slice = 0; slice <= this.slices; ++slice) {
 			var theta = dTheta * slice;
 			this.vertices.push(radius * Math.cos(theta),radius*Math.sin(theta),height);

			var vecDiffSlice = vec3.fromValues(radius*(-Math.sin(theta))*dTheta, radius*Math.cos(theta)*dTheta, 0);
			var vecDiffStack = vec3.fromValues(Math.cos(theta)*dRadius, Math.sin(theta)*dRadius, dHeight);
			vec3.cross(vecNormal, vecDiffSlice, vecDiffStack);
			vec3.normalize(vecNormal, vecNormal);

 			this.normals.push(vecNormal[0],vecNormal[1],vecNormal[2]);
 			this.texCoords.push(slice/this.slices, 1-stack/this.stacks);
 		}
 	}

 	this.indices=[];
 	for (var stack = 0; stack < this.stacks; ++stack) {
 		for (var slice = 0; slice < this.slices; ++slice) {
 			this.indices.push(stack * (this.slices+1) + slice, stack * (this.slices+1) + slice + 1, (stack+1) * (this.slices+1) + slice + 1);
 			this.indices.push(stack * (this.slices+1) + slice, (stack+1) * (this.slices+1) + slice + 1, (stack+1) * (this.slices+1) + slice);
 		}
 	}
	
    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };

MyCylinder.prototype.scaleTexCoords = function(ampS, ampT) {
	this.updateTexCoordsGLBuffers();
}