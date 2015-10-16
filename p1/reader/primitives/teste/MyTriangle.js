/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, args) {
    CGFobject.call(this, scene);

    this.args = args;

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;



function CGFtexturedTriangle(scene, textureUrl, amplifS, amplifT, v1, v2, v3) {
    CGFobject.call(this, scene);

	this.amplifS = amplifS;
	this.amplifT = amplifT;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;

	this.a = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) + 
			 		   (v1[1] - v3[1]) * (v1[1] - v3[1]) +
			 		   (v1[2] - v3[2]) * (v1[2] - v3[2]));

	this.b = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) + 
			 		   (v2[1] - v1[1]) * (v2[1] - v1[1]) +
			 		   (v2[2] - v1[2]) * (v2[2] - v1[2]));

	this.c = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) + 
			 		   (v3[1] - v2[1]) * (v3[1] - v2[1]) +
			 		   (v3[2] - v2[2]) * (v3[2] - v2[2]));


	//var max = Math.max (this.a, this.b, this.c);
	//this.a = this.a / max;
	//this.b = this.b / max;
	//this.c = this.c / max;
	
	this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
	this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);
				
	this.beta = Math.acos(this.cosBeta);
	this.alpha = Math.acos(this.cosAlpha);
	this.gamma = Math.acos(this.cosGamma);
	this.sum = this.beta + this.alpha + this.gamma;
	// the sum of internal angles needs to be 180 or 3.14159
	// check this.sum to see that!

	
    this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
	if (textureUrl != null) {
		this.texture = new CGFtexture(scene, textureUrl);
		this.appearance.setTexture(this.texture);
		this.appearance.setTextureWrap ('REPEAT', 'REPEAT');
	}
	this.initBuffers();
    this.wireframe = false;


};

CGFtexturedTriangle.prototype.initBuffers = function () {

    this.vertices = [
        // Front face
        this.v1[0],this.v1[1],this.v1[2],
        this.v2[0],this.v2[1],this.v2[2],
        this.v3[0],this.v3[1],this.v3[2]
      
    ];

    this.normals = [
        // Front face
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0
    ];

	this.texCoords = [
	  (this.c - this.a * Math.cos(this.beta)) / this.amplifS, 0.0,
	  0.0, 1 / this.amplifT,
	  this.c / this.amplifS, 1.0 / this.amplifT
    ];

    this.indices = [
        0, 1, 2
    ];

    this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
    this.initGLBuffers();

};

MyTriangle.prototype.updateTex = function(S, T) {
	
	c = this.a*this.cosBeta;
	p1_1 = c - this.a*this.cosBeta;
	p1_2 = this.a*(1-(this.cosBeta)^2);
	this.texCoords = [
		    0, 0,
		    c, 0,
		    1, 1
    ];
	
	  this.updateTexCoordsGLBuffers();
	
};
