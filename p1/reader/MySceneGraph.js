var deg2rad = Math.PI / 180;
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	 this.reader = new LSXReader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLeaves(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	
	error = this.parseNodes(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseInitials = function(rootElement) {
	
	this.scene.loadIdentity();
	this.matrixIdentity = this.scene.getMatrix();

	//<INITIALS>
	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}
	var initials = elems[0];
	
	//<frustum>
	var frust = elems[0].children[0];

	var near = this.reader.getFloat(frust, 'near');
	var far = this.reader.getFloat(frust, 'far');
 
 		
	
	//<translate>
	var translate = elems[0].children[1];
	
	var tX = translate.getAttribute('x');
	var tY = translate.getAttribute('y');
	var tZ = translate.getAttribute('z');

	this.scene.translate(tX, tY, tZ);
	


	//<rotation3>
	var rotation3 = elems[0].children[2];
	
	var taxis3 = rotation3.getAttribute('axis');
	var angleDegree = rotation3.getAttribute('angle');
	var angleRad = deg2rad*angleDegree;
	this.scene.rotate(angleRad, 1, 0,0);
	

	//<rotation2>
	var rotation2=elems[0].children[3];
	
	var taxis2 = rotation2.getAttribute('axis');
	angleDegree = rotation2.getAttribute('angle');
	angleRad = deg2rad*angleDegree;

	this.scene.rotate(angleRad, 0,1,0);

	//<rotation1>
	var rotation1=elems[0].children[4];
	var taxis1 = rotation1.getAttribute('axis');
	angleDegree = rotation1.getAttribute('angle');
	var angleRad = deg2rad*angleDegree;
	this.scene.rotate(angleRad, 0,0,1);

 	//scale
 	var scale = elems[0].children[5];
 	var sx = this.reader.getFloat(scale,'sx');
 	var sy = this.reader.getFloat(scale,'sy');
 	var sz = this.reader.getFloat(scale,'sz');
	
	
	this.scene.scale(sx,sy,sz);


	this.startMatrix = this.scene.getMatrix();
	
	this.camera = new CGFcamera(0.4, near, far, vec3.fromValues(100, 100, 100), vec3.fromValues(0, 0, 0));

	//<reference>
	var axis_length = this.reader.getFloat(elems[0].children[6],'length');
	this.scene.axis = new CGFaxis(this.scene, axis_length);

	//<ILLUMINATION>
	var tempIllumination=rootElement.getElementsByTagName('ILLUMINATION');

	if (tempIllumination == null  || tempIllumination.length==0) {
		return "illumination element is missing.";
	}
	
	this.illumination=[];
	// iterate over every element


	var ilum=tempIllumination[0].children[0];

	var back=tempIllumination[0].children[1];
	var tempAmbient = [0.,0., 0.,0.];
	var tempBackground = [0.,0., 0.,0.];
	this.background = [0, 0, 0, 0];

	
	tempAmbient[0] = ilum.getAttribute('r');
	tempAmbient[1] = ilum.getAttribute('g');
	tempAmbient[2] = ilum.getAttribute('b');
	tempAmbient[3] = ilum.getAttribute('a');
	this.ambient = tempAmbient;
	
	tempBackground[0] = back.getAttribute('r');
	tempBackground[1] = back.getAttribute('g');
	tempBackground[2] = back.getAttribute('b');
	tempBackground[3] = back.getAttribute('a');
	this.background = tempBackground;

};


MySceneGraph.prototype.parseLights = function(rootElement){
	
	var tempLights = rootElement.getElementsByTagName('LIGHTS');

	var nnodes=tempLights[0].children.length;
	
	for (i = 0; i < nnodes; i++) { 
		light = tempLights[0].children[i];
		id = light.getAttribute('id');
		var tempEnable = light.getElementsByTagName('enable');
		
		n_light = this.scene.lights[i];

		if(this.reader.getBoolean(tempEnable[0],'value'))
			n_light.enable();
		else
			n_light.disable();
		
		//position
		var position = light.getElementsByTagName('position');
		var x = this.reader.getFloat(position[0], 'x');
		var y = this.reader.getFloat(position[0], 'y');
		var z = this.reader.getFloat(position[0], 'z');
		var w = this.reader.getFloat(position[0], 'w');
		
		n_light.setPosition(x,y,z,w);
		
		//ambient
		var ambient = light.getElementsByTagName('ambient');
		var r = this.reader.getFloat(ambient[0], 'r');
		var g = this.reader.getFloat(ambient[0], 'g');
		var b = this.reader.getFloat(ambient[0], 'b');
		var a = this.reader.getFloat(ambient[0], 'a');
		
		n_light.setAmbient(r,g,b,a);
		
		//diffuse
		var diffuse = light.getElementsByTagName('diffuse');
		r = this.reader.getFloat(diffuse[0], 'r');
		g = this.reader.getFloat(diffuse[0], 'g');
		b = this.reader.getFloat(diffuse[0], 'b');
		a = this.reader.getFloat(diffuse[0], 'a');
		
		n_light.setDiffuse(r,g,b,a);
		
		//specular
		var specular = light.getElementsByTagName('specular');
		r = this.reader.getFloat(specular[0], 'r');
		g = this.reader.getFloat(specular[0], 'g');
		b = this.reader.getFloat(specular[0], 'b');
		a = this.reader.getFloat(specular[0], 'a');
		
		n_light.setSpecular(r,g,b,a);
		
		this.scene.addLight(n_light, i);
		
	}
	
}


MySceneGraph.prototype.parseTextures = function(rootElement){

//<TEXTURES>
  var tempTextures=rootElement.getElementsByTagName('TEXTURES');
  if (tempTextures == null) {
    return "Textures element is missing.";
  }

  if (tempTextures.length != 1) {
    return "either zero or more than one 'Textures' element found.";
  }
  console.log(tempTextures[0]);

    //<TEXTURE>
  var tTextures=tempTextures[0].getElementsByTagName('TEXTURE');
  var nTextures;
  if (tempTextures == null) {
    return "Textures element is missing.";
  }
  for(nTextures=0; nTextures<tTextures.length; nTextures++){
    var IDtexture = tTextures[nTextures].getAttribute("id");
    console.log(IDtexture);
    
    //<file path="ss" />                             <!-- path to file -->
    var tPath=tTextures[nTextures].children[0].getAttribute("path");
        //<amplif_factor s="ff" t="ff" />                <!-- x/s, y/t -->
    var tAmpS=tTextures[nTextures].children[1].getAttribute("s");
    var tAmpT=tTextures[nTextures].children[1].getAttribute("t");

	
	texture = new SceneTexture(this.scene, tPath,  IDtexture);
	texture.setAmplifyFactor(tAmpS, tAmpT);


	this.scene.addTexture(texture, IDtexture);
	
  }
}


MySceneGraph.prototype.parseMaterials = function(rootElement){
	//<MATERIALS>
  var tempMaterials=rootElement.getElementsByTagName('MATERIALS');
  if (tempMaterials == null) {
    return "Materials element is missing.";
  }

  if (tempMaterials.length != 1) {
    return "either zero or more than one 'Materials' element found.";
  }
  console.log(tempMaterials[0]);

  //<MATERIAL id="ss">
  var tMaterials=tempMaterials[0].getElementsByTagName('MATERIAL');
  var nMaterials;
  if (tempMaterials == null) {
    return "Materials element is missing.";
  }
  for(nMaterials=0; nMaterials<tMaterials.length; nMaterials++){
    var IDMaterial = tMaterials[nMaterials].getAttribute("id");
    console.log(IDMaterial);
	
	material = new CGFappearance(this.scene);
	
    //<shininess value="ff" />
    var shininess=tMaterials[nMaterials].children[0].getAttribute("value");
	
	material.setShininess( shininess );
    
	//<specular r="ff" g="ff" b="ff" a="ff" />
    var r=tMaterials[nMaterials].children[1].getAttribute("r");
    var g=tMaterials[nMaterials].children[1].getAttribute("g");
    var b=tMaterials[nMaterials].children[1].getAttribute("b");
    var a=tMaterials[nMaterials].children[1].getAttribute("a");
	
	material.setSpecular( r, g, b, a )
	

    //<diffuse r="ff" g="ff" b="ff" a="ff" />
    r=tMaterials[nMaterials].children[2].getAttribute("r");
    g=tMaterials[nMaterials].children[2].getAttribute("g");
    b =tMaterials[nMaterials].children[2].getAttribute("b");
    a=tMaterials[nMaterials].children[2].getAttribute("a");
	
	material.setDiffuse( r, g, b, a);

    //<ambient r="ff" g="ff" b="ff" a="ff" />
	r = tMaterials[nMaterials].children[3].getAttribute("r");
    g = tMaterials[nMaterials].children[3].getAttribute("g");
    b = tMaterials[nMaterials].children[3].getAttribute("b");
    a = tMaterials[nMaterials].children[3].getAttribute("a");

	material.setAmbient(r, g, b, a);
	
    //<emission r="ff" g="ff" b="ff" a="ff" />
    r =tMaterials[nMaterials].children[4].getAttribute("r");
    g =tMaterials[nMaterials].children[4].getAttribute("g");
    b =tMaterials[nMaterials].children[4].getAttribute("b");
    a =tMaterials[nMaterials].children[4].getAttribute("a");

	material.setEmission( r, g, b, a );
	
	this.scene.addMaterial(material, IDMaterial);
  }
}


MySceneGraph.prototype.parseLeaves = function(rootElement){
  	//<LEAVES>
	  var tempLeaves = rootElement.getElementsByTagName('LEAVES');
	  var nLeaves=tempLeaves[0].children.length;
	  for (i = 0; i < nLeaves; i++) {
			var leaf = tempLeaves[0].children[i];
			
			var idLeaf = this.reader.getString(leaf, 'id');
	
			var typeLeaf =  this.reader.getString(leaf, 'type');
			var argsLeaf;

    
    	switch(typeLeaf){
    		//<LEAF id="idRectangle" type="rectangle" args="0 1 1 0" />
    		case "rectangle":
				argsLeaf = this.reader.getRectangle(leaf, "args");
				newLeaf = new LeafRectangle(idLeaf, argsLeaf[0], argsLeaf[1], argsLeaf[2], argsLeaf[3]);
				this.scene.addLeaf(idLeaf, newLeaf);
				break;
			//<LEAF id="idCylinder" type="cylinder" args="ff ff ff ii ii" />
			case "cylinder":
				argsLeaf = this.reader.getCylinder(leaf, "args");
				newLeaf = new LeafCylinder(idLeaf, argsLeaf[0], argsLeaf[1], argsLeaf[2], argsLeaf[3], argsLeaf[4]);
				this.scene.addLeaf(idLeaf, newLeaf);
				break;
			//<LEAF id="idSphere" type="sphere" args="ff ii ii" />
			case "sphere":
				argsLeaf = this.reader.getSphere(leaf, "args");
				newLeaf = new LeafSphere(idLeaf, argsLeaf[0], argsLeaf[1], argsLeaf[2]);
				this.scene.addLeaf(idLeaf, newLeaf);
				break;
			//<LEAF id="idTriangle" type="triangle" args="ff ff ff  ff ff ff  ff ff ff" />
			case "triangle":
				argsLeaf = this.reader.getTriangle(leaf, "args");
				newLeaf = new LeafTriangle(idLeaf, argsLeaf[0], argsLeaf[1], argsLeaf[2], argsLeaf[3], 
				argsLeaf[4], argsLeaf[5], argsLeaf[6], argsLeaf[7], argsLeaf[8]);
				this.scene.addLeaf(idLeaf, newLeaf);
				break;
			default:
				return "Unknown LEAF type: " + typeLeaf;
    	}

	}
}


MySceneGraph.prototype.parseNodes = function(rootElement){

	console.log('ParseNodes')

	  var tempNodes = rootElement.getElementsByTagName('NODES');

	  var nnodes=tempNodes[0].children.length;
	 
	  //Special Case - Root
	  root = tempNodes[0].children[0];
	  id = root.getAttribute('id');
	  this.scene.setRoot(id, this.startMatrix);
	  //Other Nodes

		var nodes = tempNodes[0].getElementsByTagName('NODE');

    	for (i = 0; i < nodes.length; i++) {
			var node = new Node(nodes[i].getAttribute('id'), this.matrixIdentity);
			node.material = this.reader.getString(nodes[i].getElementsByTagName('MATERIAL')[0], 'id');
			node.texture = this.reader.getString(nodes[i].getElementsByTagName('TEXTURE')[0], 'id');

        // Transforms
        var children = nodes[i].children;
        for (j = 0; j < children.length; j++) {
            switch(children[j].tagName) {
            case "TRANSLATION":
                var trans = [];
                trans.push(this.reader.getFloat(children[j], "x"));
                trans.push(this.reader.getFloat(children[j], "y"));
                trans.push(this.reader.getFloat(children[j], "z"));
                // console.log("trans: " + trans);
                mat4.translate(node.localTransformations, node.localTransformations, trans);
                break;
            case "SCALE":
                var scale = [];
                scale.push(this.reader.getFloat(children[j], "sx"));
                scale.push(this.reader.getFloat(children[j], "sy"));
                scale.push(this.reader.getFloat(children[j], "sz"));
                // console.log("scale: " + scale);
                mat4.scale(node.localTransformations, node.localTransformations, scale);
                break;
            case "ROTATION":
                var axis = this.reader.getItem(children[j], "axis", ["x", "y", "z"]);
                var angle = this.reader.getFloat(children[j], "angle") * deg2rad;
                var rot = [0, 0, 0];

                // console.log("rot: " + axis + " " + angle + " ");
                rot[["x", "y", "z"].indexOf(axis)] = 1;
                mat4.rotate(node.localTransformations, node.localTransformations, angle, rot);
                break;
            }
        }

        //Descendants
        var desc = nodes[i].getElementsByTagName('DESCENDANTS')[0];
        if (desc == null) return "No <DESCENDANTS> tag found";

        var tempDescendants = desc.getElementsByTagName('DESCENDANT');
        if (tempDescendants.length < 1) return "Need at least 1 <DESCENDANT>";

		var nDescendants = tempDescendants.length;
		var descendants = new Array();
        for (j = 0; j < nDescendants; j++) {
            descID = tempDescendants[j].getAttribute('id');
		  	descendants[j] = descID;
        }
        node.children = descendants;
	  }
}
  
  

/*
 * Callback to be executed on any read error
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+ message);	
	this.loadedOk=false;
};


