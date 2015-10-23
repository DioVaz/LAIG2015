/**
 * MyTriangle
 * @constructor
 * @param scene CGFscene
 * @param x1 x-coord of vertice v1
 * @param y1 y-coord of vertice v1
 * @param z1 z-coord of vertice v1
 * @param x2 x-coord of vertice v2
 * @param y2 y-coord of vertice v2
 * @param z2 z-coord of vertice v2
 * @param x3 x-coord of vertice v3
 * @param y3 y-coord of vertice v3
 * @param z3 xzcoord of vertice v3
 */
function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    CGFobject.call(this, scene);

    this.v1 = vec3.fromValues(x1, y1, z1);
	this.v2 = vec3.fromValues(x2, y2, z2);
	this.v3 = vec3.fromValues(x3, y3, z3);

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.v1[0], this.v1[1], this.v1[2],
    	this.v2[0], this.v2[1], this.v2[2],
    	this.v3[0], this.v3[1], this.v3[2]
    ];

    this.indices = [
        0, 1, 2,
    ];

	// Get normals
    var AB = vec3.create();
    vec3.sub(AB, this.v2, this.v1);
    var AC = vec3.create();
    vec3.sub(AC, this.v3, this.v1);

	var N = vec3.create();
	vec3.cross(N, AB, AC);
	vec3.normalize(N, N);

	  this.normals = [
		    N[0], N[1], N[2],
		    N[0], N[1], N[2],
		    N[0], N[1], N[2],
    ];

	this.a = Math.sqrt((this.v1[0] - this.v3[0]) * (this.v1[0] - this.v3[0]) + 
			 		   (this.v1[1] - this.v3[1]) * (this.v1[1] - this.v3[1]) +
			 		   (this.v1[2] - this.v3[2]) * (this.v1[2] - this.v3[2]));

	this.b = Math.sqrt((this.v2[0] - this.v1[0]) * (this.v2[0] - this.v1[0]) + 
			 		   (this.v2[1] - this.v1[1]) * (this.v2[1] - this.v1[1]) +
			 		   (this.v2[2] - this.v1[2]) * (this.v2[2] - this.v1[2]));

	this.c = Math.sqrt((this.v3[0] - this.v2[0]) * (this.v3[0] - this.v2[0]) + 
			 		   (this.v3[1] - this.v2[1]) * (this.v3[1] - this.v2[1]) +
			 		   (this.v3[2] - this.v2[2]) * (this.v3[2] - this.v2[2]));
					   
					   
	this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
	this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);
				
	this.beta = Math.acos(this.cosBeta);
	this.alpha = Math.acos(this.cosAlpha);
	this.gamma = Math.acos(this.cosGamma);
	this.sum = this.beta + this.alpha + this.gamma;
	

	this.baseTexCoords = [
	  (this.c - this.a * Math.cos(this.beta)), 0.0,
	  0.0, 1,
	  this.c , 1.0 
    ];
	
	this.texCoords = this.baseTexCoords.slice();


 
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.scaleTexCoords = function(ampS, ampT) {
    for (var i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/ampS;
        this.texCoords[i+1] = this.baseTexCoords[i+1]/ampT;
    }

    this.updateTexCoordsGLBuffers();
};
