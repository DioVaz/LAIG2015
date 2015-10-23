/**
 * MyInterface
 * @constructor
 */
 
 function MyInterface() {
	//calls CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface
 * @application CGFapplication object
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
};

/**
 * After the graphscene been loaded, adds lights controllers
 */
MyInterface.prototype.onGraphLoaded = function(){
    var group = this.gui.addFolder('Lights');
    group.open();
	var self = this;

	for(key in this.scene.lightsEnabled){
	    var controller = group.add(this.scene.lightsEnabled,key);
	    controller.onChange(function(enable) {
	    	if(this.property == 'All'){
	    		
	    	}
	    	self.scene.updateLight(this.property, enable);
	    });
	}
}


/*
 * Handles events from the mouse - Rotations and zoom
 */
MyInterface.prototype.processKeyboard = function(event)
{
		CGFinterface.prototype.processKeyboard.call(this,event);
		console.log('Key presssed: ', event);
		var speed=0.05;
		var zoom = 1;
	
		switch (event.charCode)
		{
			//'a'
			case (97): 		this.scene.camera.orbit('y', -speed );  break;
			//'d'
			case (100): 	this.scene.camera.orbit('y', speed ); break;
			//'w'
			case (119): 	this.scene.camera.zoom(zoom); break;
				
			//'s'
			case (115): 	this.scene.camera.zoom(-zoom); break;


			//'i'
			case(105):        this.scene.camera.pan([0,zoom/2,0] );  break;
			//'k'
			case(107):        this.scene.camera.pan([0,-zoom/2,0] );  break;
			//'j'
			case(106):        this.scene.camera.pan([-zoom/2,0,0] );  break;
			//'l'
			case(108):        this.scene.camera.pan([zoom/2,0,0] );  break;

		}
}



/**
 * Set the scene for the interface
 * @param CGFinterface
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}
    