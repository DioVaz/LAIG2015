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
/**
 * Set the scene for the interface
 * @param CGFinterface
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}
    