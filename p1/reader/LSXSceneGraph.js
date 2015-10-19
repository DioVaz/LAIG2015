/*
 * LSXSceneGraph
 * @constructor 
 * @param filename filename of the scene
 * @param CGFscene object
*/
function LSXSceneGraph(filename, scene) {
    if (typeof scene.onGraphLoaded !== 'function') {
		console.error("onGraphLoaded not defined in scene");
		return;
	}
	this.loadedOk = null;
	this.filename = 'scenes/'+filename;
	
    this.initials = new Initials();
    this.illumination = new Illumination();
    this.lights = [];
    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.nodes = [];


	this.scene = scene;
	scene.graph=this;
		
	//File reader
	this.reader = new LSXReader();


	//Reads content of filename. Returns message erros in case of fail
	this.reader.open(this.filename, this);  
}

/*
 * Function called if the XML was sucessful read
 */
LSXSceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	
	var error = this.parseSceneGraph(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	this.scene.onGraphLoaded();
};

LSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "SCENE") {
        return "Not a SCENE file";
    }
	
	//The order must be correct
	if (rootElement.children[0].nodeName != "INITIALS" ||
		rootElement.children[1].nodeName != "ILLUMINATION" ||
		rootElement.children[2].nodeName != "LIGHTS" ||
		rootElement.children[3].nodeName != "TEXTURES" ||
		rootElement.children[4].nodeName != "MATERIALS" ||
		rootElement.children[5].nodeName != "LEAVES" ||
		rootElement.children[6].nodeName != "NODES")
		console.warn("The order of the TAGS is wrong");
	

	console.log("*******INITIALS*******");
    var error = this.parseInitials(rootElement);
    if (error) {
        return error;
    }

	console.log("*******ILLUMINATION*******");
    error = this.parseIllumination(rootElement);
    if (error) {
        return error;
    }

 	console.log("*******LIGHTS*******");
    error = this.parseLights(rootElement);
    if (error) {
        return error;
    }

	console.log("*******TEXTURES*******");
    error = this.parseTextures(rootElement);
    if (error) {
        return error;
    }

	console.log("*******MATERIALS*******");
    error = this.parseMaterials(rootElement);
    if (error) {
        return error;
    }

	console.log("*******LEAVES*******");
    error = this.parseLeaves(rootElement);
    if (error) {
        return error;
    }

	console.log("*******NODES*******");
    error = this.parseNodes(rootElement);
    if (error) {
        return error;
    }

	console.log("**************");

    this.loadedOk = true;
}

LSXSceneGraph.prototype.parseInitials = function(rootElement) {

	var elems =  rootElement.getElementsByTagName("INITIALS");
	if (elems == null) {
		return "INITIALS missing";
	}

	if (elems.length != 1) {
		return "Only one INITIALS is accepted";
	}

	var initials = elems[0];
	
	elems = initials.getElementsByTagName("frustum");
	if (elems == null) {
	    return "frustum in INITIALS is missing.";
	}
	if (elems.length != 1) {
	    return "only one frustum is accepted in INITIALS.";
	}

	var frustum = elems[0];

	this.initials.frustum.near = this.reader.getFloat(frustum, "near");
	
	if (this.initials.frustum.near == null)
		return "Frustum near is missing";
	if (isNaN(this.initials.frustum.near))
		return "Frustum near is NaN";

	this.initials.frustum.far = this.reader.getFloat(frustum, "far");
	if (this.initials.frustum.far == null)
		return "Frustum far is missing";
	if (isNaN(this.initials.frustum.far))
		return "Frustum far is NaN";

    elems = initials.getElementsByTagName("translation");
	if (elems == null) {
	    return "translation element in INITIALS is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'translation' element found in INITIALS.";
	}

    var translation = elems[0];
    var translationData = vec3.create();
    translationData[0] = this.reader.getFloat(translation, "x");
    if (translationData[0] == null)
		return "Translation x attribute missing";
	if (isNaN(translationData[0]))
		return "Translation x is not a number";
    translationData[1] = this.reader.getFloat(translation, "y");
    if (translationData[1] == null)
		return "Translation y attribute missing";
	if (isNaN(translationData[1]))
		return "Translation y is not a number";
    translationData[2] = this.reader.getFloat(translation, "z");
    if (translationData[2] == null)
		return "Translation z attribute missing";
	if (isNaN(translationData[2]))
		return "Translation z is not a number";

    mat4.translate(this.initials.localTransformations, this.initials.localTransformations, translationData);

    elems = initials.getElementsByTagName("rotation");
	if (elems == null) {
	    return "rotation element in INITIALS is missing.";
	}
    if (elems.length != 3) {
        return "3 'rotation' elements needed in INITIALS";
    }

	var rotations = []
    for (var i = 0; i < elems.length; ++i) {
    	var rotation = elems[i];
    	var axis = this.reader.getString(rotation, "axis");
    	if (["x", "y", "z"].indexOf(axis) == -1)
    		return "Unknow axis: " + axis;
		if (axis in rotations)
			return "Duplicate initial rotation on axis " + axis;

    	var angle = this.reader.getString(rotation, "angle");
    	rotations[axis] = angle;
    }
	mat4.rotateX(this.initials.localTransformations, this.initials.localTransformations, rotations["x"] * Math.PI / 180);
	mat4.rotateY(this.initials.localTransformations, this.initials.localTransformations, rotations["y"] * Math.PI / 180);
	mat4.rotateZ(this.initials.localTransformations, this.initials.localTransformations, rotations["z"] * Math.PI / 180);

    elems = initials.getElementsByTagName("scale");
	if (elems == null) {
	    return "scale element in INITIALS is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'scale' element found in INITIALS.";
	}

	var scale = elems[0];
    var scaleData = vec3.create();
    scaleData[0] = this.reader.getFloat(scale, "sx");
    scaleData[1] = this.reader.getFloat(scale, "sy");
    scaleData[2] = this.reader.getFloat(scale, "sz");
    mat4.scale(this.initials.localTransformations, this.initials.localTransformations, scaleData);

    elems = initials.getElementsByTagName("reference");
	if (elems == null) {
	    return "reference element in INITIALS is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'reference' element found in INITIALS.";
	}

	var reference = elems[0];
	this.initials.referenceLength = this.reader.getFloat(reference, "length");

	if (initials.children[0].nodeName != "frustum" ||
	    initials.children[1].nodeName != "translation" ||
	    initials.children[2].nodeName != "rotation" ||
	    initials.children[3].nodeName != "rotation" ||
	    initials.children[4].nodeName != "rotation" ||
	    initials.children[5].nodeName != "scale" ||
	    initials.children[6].nodeName != "reference")
		console.warn("Wrong order of children on INITIALS, parsing as default order(Translation, Rotation, Scale)");

	this.initials;
};

LSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	var elems =  rootElement.getElementsByTagName("ILLUMINATION");
	if (elems == null) {
		return "ILLUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'ILLUMINATION' element found.";
	}

	var illumination = elems[0];

    elems = illumination.getElementsByTagName("ambient");
    if (elems == null) {
		return "ambient element in ILLUMINATION is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'ambient' element found in ILLUMINATION.";
	}

	var ambient = elems[0];
	this.illumination.ambient = this.reader.getRGBA(ambient);

    elems = illumination.getElementsByTagName("background");
    if (elems == null) {
		return "background element in ILLUMINATION is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'background' element found in ILLUMINATION.";
	}

	var background = elems[0];
	this.illumination.background = this.reader.getRGBA(background);

}

LSXSceneGraph.prototype.parseLights = function(rootElement) {
    var elems =  rootElement.getElementsByTagName("LIGHTS");
	if (elems == null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LIGHTS' element found.";
	}

	var lights = elems[0];

	for (var i = 0; i < lights.children.length; ++i) {
		var light = lights.children[i];
		if (light.nodeName != "LIGHT")
			return "Unknown element found in LIGHTS: " + light.nodeName;
		var id = this.reader.getString(light, "id");
		if (id == null)
			return "id attribute missing for LIGHT";

		this.lights.push(new Light(this.scene, i, id));

		var enable = this.reader.getBoolean(light.children[0], "value");
		if (enable)
			this.lights[i].enable();
		else
			this.lights[i].disable();

		var data = [];
		data.push(this.reader.getFloat(light.children[1], "x"));
		data.push(this.reader.getFloat(light.children[1], "y"));
		data.push(this.reader.getFloat(light.children[1], "z"));
		data.push(this.reader.getFloat(light.children[1], "w"));
		this.lights[i].setPosition(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(light.children[2]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(light.children[3]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(light.children[4]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
	}
}

LSXSceneGraph.prototype.parseTextures = function(rootElement) {
    var elems =  rootElement.getElementsByTagName("TEXTURES");
	if (elems == null) {
		return "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'TEXTURES' element found.";
	}

	var textures = elems[0];

	elems = textures.getElementsByTagName("TEXTURE");

	if (elems == null) {
		console.log("TEXTURE element in TEXTURES missing");
		return;
	}
	if (elems.length == 0) {
		console.log("zero 'TEXTURE' elements found");
		return;
	}

	var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));

	for (var i = 0; i < elems.length; ++i) {
		var texture = elems[i];
		var id = this.reader.getString(texture, "id");
		if (id in this.textures)
			return "Duplicate texture id: " + id;

		var path = pathRel + '/' + this.reader.getString(texture.children[0], "path");
		var s = this.reader.getFloat(texture.children[1], "s");
		var t = this.reader.getFloat(texture.children[1], "t");
		this.textures[id] = new Texture(this.scene, path, id);
		this.textures[id].setAmplifyFactor(s,t);
	}
}

LSXSceneGraph.prototype.parseMaterials = function(rootElement) {
    var elems =  rootElement.getElementsByTagName("MATERIALS");
	if (elems == null) {
		return "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'MATERIALS' element found.";
	}

	var materials = elems[0];

	for(var i = 0; i < materials.children.length; ++i){
		var material = materials.children[i];
		var id = this.reader.getString(material,"id");
		if (id in this.materials)
			return "Duplicate material id: " + id;

		this.materials[id] = new Material(this.scene,id);
		var shininess = this.reader.getFloat(material.children[0],"value");
		this.materials[id].setShininess(shininess);
		var data = this.reader.getRGBA(material.children[1]);
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[2]);
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[3]);
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
	}
}

LSXSceneGraph.prototype.parseLeaves = function(rootElement) {
    var elems =  rootElement.getElementsByTagName("LEAVES");
	if (elems == null) {
		return "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}

	var leaves = elems[0];

	elems = leaves.getElementsByTagName("LEAF");

	if (elems == null) {
		return "LEAF element in LEAVES missing";
	}
	if (elems.length == 0) {
		return "zero 'LEAF' elements found"
	}

	for (var i = 0; i < elems.length; ++i) {
		var leaf = elems[i]
		var id = this.reader.getString(leaf, "id");
		if (id in this.leaves)
			return "Duplicate leaf id: " + id;

		var type = this.reader.getString(leaf, "type");
		var data;

		switch (type) {
			case "rectangle":
				data = this.reader.getRectangle(leaf, "args");
				if (data == null)
					return "Error parsing rectangle " + id + " args"; 
				this.leaves[id] = new LeafRectangle(id, data[0], data[1], data[2], data[3]);
				break;
			case "cylinder":
				data = this.reader.getCylinder(leaf, "args");
				if (data == null)
					return "Error parsing cylinder " + id + " args";
				this.leaves[id] = new LeafCylinder(id, data[0], data[1], data[2], data[3], data[4]);
				break;
			case "sphere":
				data = this.reader.getSphere(leaf, "args");
				if (data == null)
					return "Error parsing sphere " + id + " args";
				this.leaves[id] = new LeafSphere(id, data[0], data[1], data[2]);
				break;
			case "triangle":
				data = this.reader.getTriangle(leaf, "args");
				if (data == null)
					return "Error parsing triangle " + id + " args";
				this.leaves[id] = new LeafTriangle(id, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
				break;
			default:
				return "Leaf type unknown: " + type;
		}
	}
}

LSXSceneGraph.prototype.parseNodes = function(rootElement) {
    var elems =  rootElement.getElementsByTagName("NODES");
	if (elems == null) {
		return "NODES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'NODES' element found.";
	}

	var nodes = elems[0];
	this.root = this.reader.getString(nodes.children[0], "id");

	elems = nodes.getElementsByTagName("NODE");

	if (elems == null) {
		return "NODE element in NODES missing";
	}
	if (elems.length == 0) {
		return "zero 'NODE' elements found"
	}

	for (var i = 0; i < elems.length; ++i) {
		var node = elems[i];

		error = this.parseNode(node);
		if (error)
			return error;
	}

	if (!(this.root in this.nodes))
		return "Node with root id missing";

	for (key in this.nodes) {
		for (var i = 0; i < this.nodes[key].children.length; ++i) {
			var child = this.nodes[key].children[i];
			if (!((child in this.nodes) || (child in this.leaves)))
				return "Child named" + child + " is missing";
		}
	}
}

LSXSceneGraph.prototype.parseNode = function(node) {
	var id = this.reader.getString(node, "id");
	console.log(id);
	if (id in this.leaves)
		return "Node id already in leaf: " + id;
	if (id in this.nodes)
		return "Duplicate node id: " + id;
	
	this.nodes[id] = new Node(id);

	var childNode = node.children[0];
	if (childNode.nodeName != "MATERIAL")
		return "Expected MATERIAL as NODE " + id + " as 1st child, found " + childNode.nodeName;
	var material = this.reader.getString(childNode, "id");
	this.nodes[id].setMaterial(material);

	childNode = node.children[1];
	if (childNode.nodeName != "TEXTURE")
		return "Expected TEXURE as NODE " + id + " as 2nd child, found " + childNode.nodeName;
	var texture = this.reader.getString(childNode, "id");
	this.nodes[id].setTexture(texture);

	for (var i = 2; i < node.children.length - 1; ++i) {
		var transformation = node.children[i];
		var type = transformation.nodeName;
		switch (type) {
			case "ROTATION":
				var axis = this.reader.getString(transformation, "axis");
				var angle = this.reader.getFloat(transformation, "angle");
					switch (axis) {
						case "x":
							this.nodes[id].rotateX(angle * Math.PI / 180);
							break;
						case "y":
							this.nodes[id].rotateY(angle * Math.PI / 180);
							break;
						case "z":
							this.nodes[id].rotateZ(angle * Math.PI / 180);
							break;
						default:
							return "Unknown rotation axis: " + axis;
					}
				break;
			case "SCALE":
				var sx = this.reader.getFloat(transformation, "sx");
				var sy = this.reader.getFloat(transformation, "sy");
				var sz = this.reader.getFloat(transformation, "sz");
				this.nodes[id].scale(sx, sy, sz);
				break;
			case "TRANSLATION":
				var x = this.reader.getFloat(transformation, "x");
				var y = this.reader.getFloat(transformation, "y");
				var z = this.reader.getFloat(transformation, "z");
				this.nodes[id].translate(x, y, z);
				break;
			default:
				return "Unknown transformation: " + type;
		}
	}

	var new_children = node.children[node.children.length - 1];
	if (new_children.nodeName != "DESCENDANTS")
		return "Expected DESCENDANTS as NODE " + id + " last child, found: " + new_children.nodeName;

	if (new_children.children.length == 0)
		return "Node " + id + " with no descendants";

	for (var i = 0; i < new_children.children.length; ++i) {
		var new_child = this.reader.getString(new_children.children[i], "id");
		this.nodes[id].addChild(new_child);
	}
}
	
/*
 * Callback to be executed on any read error
 */
 
LSXSceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};