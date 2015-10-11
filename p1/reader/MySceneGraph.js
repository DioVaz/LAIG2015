var degToRad = Math.PI / 180;
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

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
 	
 	//scale
 	var scale = elems[0].children[5];
 	var sx = this.reader.getFloat(scale,'sx');
 	var sy = this.reader.getFloat(scale,'sy');
 	var sz = this.reader.getFloat(scale,'sz');
	this.scene.scale(sx, sy, sz);
	
		//<rotation3>
	var rotation3 = elems[0].children[2];
	
	var taxis3 = rotation3.getAttribute('axis');
	var angleDegree = rotation3.getAttribute('angle');
	var angleRad = degToRad*angleDegree;
	this.scene.rotate(angleRad, 1, 0,0);
		
	//<rotation2>
	var rotation2=elems[0].children[3];
	
	var taxis2 = rotation2.getAttribute('axis');
	angleDegree = rotation2.getAttribute('angle');
	angleRad = degToRad*angleDegree;
	
	this.scene.rotate(angleRad, 0,1,0);

	//<rotation1>
	var rotation1=elems[0].children[4];

	var taxis1 = rotation1.getAttribute('axis');
	angleDegree = rotation1.getAttribute('angle');
	
	var angleRad = degToRad*angleDegree;
	
	this.scene.rotate(angleRad, 0,0,1);
	
	
	//<translate>
	var translate = elems[0].children[1];
	
	var tX = translate.getAttribute('x');
	var tY = translate.getAttribute('y');
	var tZ = translate.getAttribute('z');
	
	this.scene.translate(tX, tY, tZ);




	this.startMatrix = this.scene.getMatrix();
	console.log(this.startMatrix);

	this.camera = new CGFcamera(0.4, near, far, vec3.fromValues(25, 25, 25), vec3.fromValues(0, 0, 0));

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
		var leave = tempLeaves[0].children[i];
		var idLeave = leave.getAttribute('id');
		var typeLeave = leave.getAttribute('type');
		var argsLeave;

    //<LEAF id="idRectangle" type="rectangle" args="0 1 1 0" />
		if(typeLeave=="rectangle"){
			  argsLeave = leave.getAttribute('args');
			  var res = str.split(" ");
			  //left-top
			  var leftTopX = res[0];
			  var leftTopY = res[1];
			  //left-bot
			  var leftBotX = res[2];
			  var leftBotY = res[3];
		}

    //<LEAF id="idCylinder" type="cylinder" args="ff ff ff ii ii" />
		if(typeLeave=="cylinder"){
			  argsLeave = leave.getAttribute('args');
			  var res = str.split(" ");
			  //height
			  var height = res[0];
			  //bottom radius
			  var bottomRadius = res[1];
			  //top radius
			  var topRadius = res[2];
			  //sections
			  var sections = res[3];
			  //parts
			  var parts = res[4];
		}

    //<LEAF id="idSphere" type="sphere" args="ff ii ii" />
		if(typeLeave=="sphere"){
			  argsLeave = leave.getAttribute('args');
			  //radius
			  var radius = res[0];
			  //parts radius
			  var partsR = res[1];
			  //parts section
			  var partsS = res[2];
		}

		//<LEAF id="idTriangle" type="triangle" args="ff ff ff  ff ff ff  ff ff ff" />
		if(typeLeave=="triangle"){
			  argsLeave = leave.getAttribute('args');
			  var res = str.split(" ");
			  //vertex a
			  var aX = res[0];
			  var aY = res[1];
			  var aZ = res[2];
			  //vertex b
			  var bX = res[3];
			  var bY = res[4];
			  var bZ = res[5];
			  //vertex c
			  var cX = res[6];
			  var cY = res[7];
			  var cZ = res[8];
		}
	}
}


MySceneGraph.prototype.parseNodes = function(rootElement){

	  var tempNodes = rootElement.getElementsByTagName('NODES');

	  var nnodes=tempNodes[0].children.length;
	 
	  //Special Case - Root
	  root = tempNodes[0].children[0];
	  id = root.getAttribute('id');
	  this.scene.setRoot(id, this.startMatrix);
	  //Other Nodes
	  for (i = 1; i < nnodes; i++) {
		node = tempNodes[0].children[i];
		a = node.getAttribute('id');
		//<MATERIAL>
		var material = node.getElementsByTagName('MATERIAL');
		var materialID = material[0].getAttribute('id');

		// <TEXTURE id="ss" />
		var texture = node.getElementsByTagName('TEXTURE');
		var textureID = texture[0].getAttribute('id');

		//<TRANSLATION x="ff" y="ff" z="ff" />
		var translation = node.getElementsByTagName('TRANSLATION');
		var X = translation[0].getAttribute('x');
		var Y = translation[0].getAttribute('y');
		var Z = translation[0].getAttribute('z');

		//<ROTATION axis="cc" angle="ff" />
		var rotation = node.getElementsByTagName('ROTATION');
		var axis = rotation[0].getAttribute('axis');
		var angle = rotation[0].getAttribute('angle');

		//<SCALE sx="ff" sy="ff" sz="ff" />
		var scale = node.getElementsByTagName('SCALE');
		var sX = scale[0].getAttribute('sx');
		var sY = scale[0].getAttribute('sy');
		var sZ = scale[0].getAttribute('sz');

		//<DESCENDANTS>
		var tempDescendants = node.getElementsByTagName('DESCENDANTS');

		var nDescendants=tempDescendants[0].children.length;
		var descendants = new Array();
		//Other Descendants
		for (j = 0; j < nDescendants; j++) {
		  elem = tempDescendants[0].children[j];
			
		  //<DESCENDANT>
		  descID = elem.getAttribute('id');
		  descendants[j] = descID;

		}
	  }
}
  
  

/*
 * Callback to be executed on any read error
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+ message);	
	this.loadedOk=false;
};


