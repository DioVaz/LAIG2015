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



MyInterface.prototype.processKeyboard = function(event)
{
		console.log('Key presssed: ', event);
		var speed=0.05;
		var zoom = 1;
		switch (String.fromCharCode(event.charCode))
		{
			case 'a': 		this.scene.camera.orbit('y', -speed );  break;
			case 'd': 		this.scene.camera.orbit('y', speed ); break;
			case 'w': 		this.scene.camera.position[2]-=zoom;  this.scene.camera.position[1]-=zoom; this.scene.camera.position[0]-=zoom; break;
			case 's': 		this.scene.camera.position[0]+=zoom; this.scene.camera.position[1]+=zoom; this.scene.camera.position[2]+=zoom; break;

		}
}



/**
 * Set the scene for the interface
 * @param CGFinterface
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}
    