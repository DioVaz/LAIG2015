
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

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseInitials= function(rootElement) {
	
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
	var frust=elems[0].children[0];
	console.log(frust)
	var left = -10;
	var right = 10;
	var bottom = -1.0;
	var top = 1.0;
	var near = frust.getAttribute('near');
	var far = frust.getAttribute('far');
     //projectionMatrix
	this.frustum = mat4.frustum(left, right, bottom, top, near, far, 0);
	
	//<translate>
	var translate=elems[0].children[1];
	var tX = 0.0;
	var tY = 0.0;
	var tZ = 0.0;
	tX = translate.getAttribute('x');
	tY = translate.getAttribute('y');
	tZ = translate.getAttribute('z');

	//<rotation3>
	var rotation3=elems[0].children[2];
	var taxis3 = 'a';
	var tangule3 = 0.0;
	taxis3 = rotation3.getAttribute('axis');
	tangule3 = rotation3.getAttribute('angle');
	this.scene.rotate(taxis3, tangule3);

	//<rotation2>
	var rotation2=elems[0].children[3];
	var taxis2 = 'a';
	var tangule2 = 0.0;
	taxis2 = rotation3.getAttribute('axis');
	tangule2 = rotation3.getAttribute('angle');
	this.scene.rotate(taxis2, tangule2);

	//<rotation1>
	var rotation1=elems[0].children[4];
	var taxis1 = 'a';
	var tangule1 = 0.0;
	taxis1 = rotation3.getAttribute('axis');
	tangule1 = rotation3.getAttribute('angle');
	console.log(taxis1+tangule1 );
	this.scene.rotate(taxis1, tangule1);

	//<reference>
	var axis_length = parseFloat(elems[0].children[6].getAttribute('length'));
	this.scene.axis = new CGFaxis(this.scene, axis_length, 0.2);

	//<ILLUMINATION>
	var tempIllumination=rootElement.getElementsByTagName('ILLUMINATION');

	if (tempIllumination == null  || tempIllumination.length==0) {
		return "illumination element is missing.";
	}
	
	this.illumination=[];
	// iterate over every element
	var nnodes=tempIllumination[0].children.length;

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

	var tempLights=rootElement.getElementsByTagName('Lights');
	

};

MySceneGraph.prototype.parseLight = function(rootElement){
	
}



var Node = function(){
	this.children = [];
	this.localTransformations = makeIdentity();
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
