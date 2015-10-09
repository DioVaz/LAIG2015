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
     //projectionMatrix
	
	//<translate>
	var translate = elems[0].children[1];
	
	var tX = translate.getAttribute('x');
	var tY = translate.getAttribute('y');
	var tZ = translate.getAttribute('z');

	//<rotation3>
	var rotation3 = elems[0].children[2];
	
	var taxis3 = rotation3.getAttribute('axis');
	var tangule3 = rotation3.getAttribute('angle');
	this.scene.rotate(taxis3, tangule3);

	//<rotation2>
	var rotation2=elems[0].children[3];
	
	var taxis2 = rotation3.getAttribute('axis');
	var tangule2 = rotation3.getAttribute('angle');
	this.scene.rotate(taxis2, tangule2);

	//<rotation1>
	var rotation1=elems[0].children[4];

	var taxis1 = rotation3.getAttribute('axis');
	var tangule1 = rotation3.getAttribute('angle');

	this.scene.rotate(taxis1, tangule1);
	
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



MySceneGraph.prototype.parseNodes = function(rootElement){
	
	var tempNodes = rootElement.getElementsByTagName('NODES');
	
	var nnodes=tempNodes[0].children.length;
	
	//Special Case - Root
	root = tempNodes[0].children[0];
	id = root.getAttribute('id');
	
	
	
	//Other Nodes
	for (i = 1; i < nnodes; i++) { 
		node = tempNodes[0].children[i];
	
		//a = node.getAttribute('MATERIAL);
		//console.log(a);
		
		
		
	}

}












/*
 * Callback to be executed on any read error
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


//CODIGO COMENTADO APAGAR ANTES DE ENTREGAR
//this.background = this.reader.getRGBA(globals, 'background');
//this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
//this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
//this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

//console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

// Create a new perspective projection matrix. The height will stay the same
// while the width will vary as per aspect ratio.


//canvas = this.getElementById("canvas");
//canvas = this.gl.canvas.clientWidth
//var ratio = canvas.clientWidth / canvas.clientHeight;

//console.log(this.reader.getItem(nnodes,'background'));
//this.background
//for (var i=0; i< nnodes; i++)
//{
//	var e=tempIllumination[0].children[i];
//	console.log(e);

//	// process each element and store its information
//	this.illumination[e.id]=e.attributes.getNamedItem("background").value;
//	console.log("Read list item id "+ e.id+" with value "+this.illumination[e.id]);
//};

