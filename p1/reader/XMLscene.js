function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

  //  this.initLights();
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	
	this.axis=new CGFaxis(this);
	this.root = "null";
	this.graphNodes = new Map();
	this.textures = new Map();
	this.materials = new Map();
	
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 2.5, 500, vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
  //  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  //  this.setSpecular(0.2, 0.4, 0.8, 1.0);
   // this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();

	this.lights[1].setVisible(true);
    this.lights[1].enable();
	this.setAmbient(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	
	this.cyl = new MyCylinder(this, 10, 5, 5,200, 200);
	

};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();
	
	
	this.multMatrix(this.graph.startMatrix);
	
	//this.applyViewMatrix();
	this.update();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.cyl.display();
	


	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		nlights = this.lights.length;
		for (i = 0; i < nlights; i++)
			this.lights[i].update();
		
	};
	 
};

XMLscene.prototype.setRoot = function(id, iMatrix){
	
	this.initalMatrix = iMatrix;
	this.root = id;
	
};

XMLscene.prototype.addNode = function(id, newNode){
	
	this.graphNodes[id] = newNode; //confirmar se ja existe no -----------------------------------
	
};

XMLscene.prototype.addTexture = function(newTexture, id){
	this.textures[id] = newTexture;
};

XMLscene.prototype.addMaterial = function(newMaterial, id){
	this.materials[id] = newMaterial;
};

XMLscene.prototype.addLight = function(newLight, i){
	this.shader.bind();
	
	this.lights[i] = newLight;
	this.lights[i].setVisible(true);
	this.lights[i].update();

	this.shader.unbind();
};

XMLscene.prototype.processGraph = function (){

	
		
};







