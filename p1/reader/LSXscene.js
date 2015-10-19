/*
 * LSXscene extends CFGscene
 * @constructor
 * @param application CFGapplication
 */
function LSXscene(application) {
    CGFscene.call(this);
}

LSXscene.prototype = Object.create(CGFscene.prototype);
LSXscene.prototype.constructor = LSXscene;

/*
 * Initializes content of scene
 * @param application CFGapplication
 */
LSXscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.myinterface = null;
    this.graph = null;

    this.initCameras();

	this.allLights = 'All';
    this.lightsEnabled = [];

	this.primitives = [];
 	

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.enableTextures(true);
};
/*
 * Sets the interface of the scene
 */
LSXscene.prototype.setInterface = function(myinterface) {
	this.myinterface = myinterface;
}

/*
 * Create camera in default position
 */
LSXscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
 * Defines default apperence
 */
LSXscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.5, 0.5, 0.5, 1);
    this.setDiffuse(0.5, 0.5, 0.5, 1);
    this.setSpecular(0.5, 0.5, 0.5, 1);
    this.setShininess(10.0);	
};

/*
 * Called on the graph is loaded ok
 */
LSXscene.prototype.onGraphLoaded = function () 
{
	this.camera.near = this.graph.initials.frustum.near;
	this.camera.far = this.graph.initials.frustum.far;

    if (this.graph.initials.referenceLength > 0)
	   this.axis = new CGFaxis(this, this.graph.initials.referenceLength);
	   
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.lights = [];

    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights.push(this.graph.lights[i]);
    	this.lights[i].setVisible(true);
    	this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
    }

	//controls all lights
    this.lightsEnabled[this.allLights] = true;

	if (this.myinterface != null)
	    this.myinterface.onGraphLoaded();

    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this, leaf.x0, leaf.y0, leaf.x1, leaf.y1);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyCylinder(this, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.sections, leaf.parts);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this, leaf.radius, leaf.stacks, leaf.sections);
				break;
    	}
    }
};

LSXscene.prototype.display = function () {
    this.shader.bind();

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	//View position initialization is equal to identity
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations from the camera setup
	this.applyViewMatrix();


	//Process scene if LSX read ok
	if (this.graph != null && this.graph.loadedOk)
	{	
		this.multMatrix(this.graph.initials.localTransformations);
	
		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();

		
		// Draw axis
		if (this.axis)
	   		this.axis.display();

	   	//Set default appearance
		this.setDefaultAppearance();

		//Draws the scene from the graph by processing all nodes starting from the root
		this.processScene();
	}	

    this.shader.unbind();
};

/*
 * Process graph starting from root
 */
LSXscene.prototype.processScene = function() {
	this.processNode(this.graph.root, "clear", "null");
	this.setDefaultAppearance();
}

/* 
 * Process node
 * @param parentTexture receives the texture from the parent
 * @param parentMaterial receives the material from the parent
 */
LSXscene.prototype.processNode = function(node, parentTexture, parentMaterial) {
	//Node is leaf
	if (node in this.primitives) {
		if (parentMaterial != "null")
			this.graph.materials[parentMaterial].apply();
		else
			this.setDefaultAppearance();
	
		var texture;

		if (parentTexture != "clear")
		{
			texture = this.graph.textures[parentTexture];
			this.primitives[node].scaleTexCoords(texture.amplifyFactor.s, texture.amplifyFactor.t);
			texture.bind();
		}
					
		this.primitives[node].display();

		if (texture)
			texture.unbind();
		return;
	}
	
	//Applies transformations
	this.pushMatrix();
	
	this.multMatrix(this.graph.nodes[node].localTransformations);

	//Receives material and texture from parent?
	var material = this.graph.nodes[node].material;
	if (material == "null")
		material = parentMaterial;

	var texture = this.graph.nodes[node].texture;
	if (texture == "null")
		texture = parentTexture;

	//Process the node's children
	var children = this.graph.nodes[node].children;
	for (var i = 0; i < children.length; ++i) {
		this.processNode(children[i], texture, material);
	}

	this.popMatrix();
}

/*
 * Updates lights from the interface
 * @param lightId
 * @param enable boolean
 */
LSXscene.prototype.updateLight = function(lightId, enable) {
	
	//Switch only one light
	if(lightId != this.allLights){
		console.log("Changing light " + lightId);
		for (var i = 0; i < this.graph.lights.length; ++i) {
			if (this.lights[i].id == lightId) {
				var light = this.lights[i];
				enable ? light.enable() : light.disable();
				return;
			}
		}
	}else{
		//Switch all lights
		console.log("Changing all lights");
		for (var i = 0; i < this.graph.lights.length; ++i) {	
			var light = this.lights[i];
			enable ? light.enable() : light.disable();

		}
	
	}
}