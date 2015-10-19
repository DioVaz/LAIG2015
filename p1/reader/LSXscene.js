//variable used to convert degrees to radians
var deg2rad = Math.PI / 180;

/**
 * LSXscene calls CGFscene
 * @constructor
 */
function LSXscene() {
    CGFscene.call(this);
}

LSXscene.prototype = Object.create(CGFscene.prototype);
LSXscene.prototype.constructor = LSXscene;

/**
 * init 
 * @param application
 */
LSXscene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);
	this.myinterface = null;
	this.initCameras();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.textures = new Map();
	this.materials = new Map();
	this.leaves = [];
	this.nodes = [];

	this.axis = new CGFaxis(this);
	this.lightsEnabled = [];
	this.allLights = "All";
	
};

LSXscene.prototype.setInterface = function(myInterface) {
	this.myInterface = myInterface;
}

LSXscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 80, 130), vec3.fromValues(0, 0, 0));
};

LSXscene.prototype.setDefaultAppearance = function() {
	idDefault = "default"
	if(!(idDefault in this.materials)){
		console.log("There isn't a default material");
		return null;
	}
	this.materials[idDefault].apply();
   
};

LSXscene.prototype.onGraphLoaded = function() {
    // Frustum
    this.camera.near = this.graph.initials.frustum.near;
    this.camera.far = this.graph.initials.frustum.far;

    this.axis = new CGFaxis(this, this.graph.initials.reference);
    

    //Illumination
     
    // Background
    var bg_illum = this.graph.illumination.background;
    this.gl.clearColor(bg_illum.r, bg_illum.g, bg_illum.b, bg_illum.a);

    // Ambient
    var ambi_illum = this.graph.illumination.ambient;
    this.setGlobalAmbientLight(ambi_illum.r, ambi_illum.g, ambi_illum.b, ambi_illum.a);

   //Lights
    this.initLights();


   this.myInterface.onGraphLoaded();

    /*
     * Textures
     */
    if (this.graph.textures.length > 0)
        this.enableTextures(true);

    var graphText = this.graph.textures;
    for (var i = 0; i < graphText.length; i++) {
       
        this.textures[graphText[i].id] = graphText[i];
    }

    /*
     * Materials
     */
    var graphMat = this.graph.materials;
    for (i = 0; i < graphMat.length; i++) {

        this.materials[graphMat[i].id] = graphMat[i];
    }

    /*
     * Leaves
     */
    this.initLeaves();

    /*
     * Nodes
     */
    this.initNodes();
};

LSXscene.prototype.display = function() {
    this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.updateProjectionMatrix();
    this.loadIdentity();

    this.applyViewMatrix();

    // If LSX has been loaded
    if (this.graph.loadedOK) {

        this.setDefaultAppearance();

        if (this.axis.length != 0) this.axis.display();

        // Apply initial transforms
        this.applyInitials();

        // Lights update
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        // Nodes

        for (i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            this.pushMatrix();
            node.material.setTexture(node.texture);
            if (node.texture != null) {
                node.primitive.updateTex(node.texture.amplif_factor.s, node.texture.amplif_factor.t);
            }
            node.material.apply();
            this.multMatrix(node.matrix);
            node.primitive.display();
            this.popMatrix();
        }

    };
    this.shader.unbind();
};

LSXscene.prototype.applyInitials = function() {
    var inits = this.graph.initials;
    var trans = inits.translation;
    var scale = inits.scale;
    var rots = inits.rotations;

    this.translate(trans.x, trans.y, trans.z);
    for (var i = 0; i < rots.length; i++) {
        switch (rots[i].axis) {
            case 'x':
                this.rotate(rots[i].angle * deg2rad, 1, 0, 0);
                break;
            case 'y':
                this.rotate(rots[i].angle * deg2rad, 0, 1, 0);
                break;
            case 'z':
                this.rotate(rots[i].angle * deg2rad, 0, 0, 1);
                break;
        }
    }
    this.scale(scale.sx, scale.sy, scale.sz);
};

LSXscene.prototype.initLights = function() {
    this.shader.bind();

    this.lights = [];

    for (var i = 0; i < this.graph.lights.length; i++) {
        var lightGraph = this.graph.lights[i];
        var newLight = new CGFlight(this, i);

        newLight.id = lightGraph.id;
        lightGraph.enabled ? newLight.enable() : newLight.disable();
        newLight.setPosition(lightGraph.position.x, lightGraph.position.y, lightGraph.position.z, lightGraph.position.w);
        newLight.setAmbient(lightGraph.ambient.r, lightGraph.ambient.g,lightGraph.ambient.b, lightGraph.ambient.a);
        newLight.setDiffuse(lightGraph.diffuse.r, lightGraph.diffuse.g, lightGraph.diffuse.b, lightGraph.diffuse.a);
        newLight.setSpecular(lightGraph.specular.r, lightGraph.specular.g, lightGraph.specular.b, lightGraph.specular.a);
        newLight.setVisible(false);
        newLight.update();

        this.lights[i] = newLight;
		this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
    }

	this.lightsEnabled[this.allLights] = true;
    this.shader.unbind();
};

LSXscene.prototype.initLeaves = function() {
    for (var i = 0; i < this.graph.leaves.length; i++) {
        var leaf = this.graph.leaves[i];
        switch (leaf.type) {
            case "rectangle":
                var primitive = new MyQuad(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "cylinder":
                primitive = new MyFullCylinder(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "sphere":
                primitive = new MySphere(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
            case "triangle":
                primitive = new MyTriangle(this, leaf.args);
                primitive.id = leaf.id;
                this.leaves.push(primitive);
                break;
        }
    }
};

LSXscene.prototype.initNodes = function() {
	console.log(this.graph.nodes);
    var nodes_list = this.graph.nodes;

    var root_node = this.graph.findNode(this.graph.root_id);
    this.Process(root_node, root_node.material, root_node.texture, root_node.matrix);
};

LSXscene.prototype.Process = function(node, currMaterial, currTexture, currMatrix) {
    var nextMat = node.material;
    if (node.material == "null") nextMat = currMaterial;

    var nextTex = node.texture;
    if (node.texture == "null") nextTex = currTexture;
    else if (node.texture == "clear") nextTex = null;

    var nextMatrix = mat4.create();
    mat4.multiply(nextMatrix, currMatrix, node.matrix);

    for (var i = 0; i < node.descendants.length; i++) {
        var nextNode = this.graph.findNode(node.descendants[i]);

        if (nextNode == null) {
            var aux = new SceneObject(node.descendants[i]);
            aux.material = this.getMaterial(nextMat);
            aux.texture = this.getTexture(nextTex);
            aux.matrix = nextMatrix;
            aux.isLeaf = true;
            for (var j = 0; j < this.leaves.length; j++) {
                if (this.leaves[j].id == aux.id) {
                    aux.primitive = this.leaves[j];
                    break;
                }
            }
            this.nodes.push(aux);
            continue;
        }

        this.Process(nextNode, nextMat, nextTex, nextMatrix);
    }
};

LSXscene.prototype.getMaterial = function(id) {
    if (id == null) return null;

    if(id in this.materials)
    	return this.materials[id];

    return null;
};

LSXscene.prototype.getTexture = function(id) {
    if (id == null) return null;

    if(id in this.textures)
    	return this.textures[id];

    return null;
};



function SceneObject(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = null;
    this.primitive = null;
}

LSXscene.prototype.updateLight = function(lightId, enable) {
	
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
		console.log("Changing all lights");
		for (var i = 0; i < this.graph.lights.length; ++i) {	
			var light = this.lights[i];
			enable ? light.enable() : light.disable();

		}
	
	}
}