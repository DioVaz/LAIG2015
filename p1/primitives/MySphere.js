
 function MySphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];

	var angle = 2*Math.PI / this.slices;
	var angle_height = (Math.PI / 2)/this.stacks;
	var stepS = 0;
	var stepT = 0;
	// topo
	for (var stack = 0; stack <= this.stacks; stack++){
		for (var slice = 0; slice <= this.slices; slice++){
			this.vertices.push(Math.cos(slice * angle) * Math.cos(stack * angle_height), Math.sin(slice * angle) * Math.cos(stack * angle_height), Math.sin(stack * angle_height));
			this.normals.push(Math.cos(slice * angle) * Math.cos(stack * angle_height), Math.sin(slice * angle) * Math.cos(stack * angle_height), Math.sin(stack * angle_height));
			this.texCoords.push(stepS, stepT);
			stepS+=1/this.slices;
		}
		stepS = 0;
		stepT+= 1/this.stacks;
	}

	this.vertices.push(0, 0, 1);
	this.normals.push(0, 0, 1);
	
	var n = this.slices + 1;
	for (var stack = 0; stack < this.stacks - 1; stack++){
		for (var slice = 0; slice < this.slices; slice++){
			this.indices.push(stack * n + slice, stack * n + ((slice + 1) % n), (stack + 1) * n + ((slice + 1) % n));
			this.indices.push(stack * n + slice, (stack + 1) * n + ((slice + 1) % n), (stack + 1) * n + slice);
		}
	}
	
	this.vertices.push(0, 0, 0);
	// base
	for (var slice = -1; slice < this.slices; slice++){
		this.vertices.push(Math.cos(slice * angle), Math.sin(slice * angle), 0);
		this.normals.push(0, 0, -1);
	}

	for (var slice = 0; slice < this.slices; slice++){
		if (slice + 1 >= this.slices){
			this.indices.push(this.stacks * this.slices + 2 + slice, this.stacks * this.slices + 1, this.stacks * this.slices + 2);
		}
		else this.indices.push(this.stacks * this.slices + 2 + slice, this.stacks * this.slices + 1, this.stacks * this.slices + 3 + slice);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };