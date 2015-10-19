/**
 * Light
 * @constructor
 * @param id identification of the light
 */
function Light(id) {
   	this.id = id;
    this.enabled = false;
    this.position = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0
    };
    this.ambient = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.diffuse = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };
    this.specular = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };

}


Light.prototype = Object.create(Light.prototype);
Light.prototype.constructor = Light;


/**
 * Prints the information of the light
 */
Light.prototype.print = function(){

	console.log("Light " + this.id + " - " + (this.enabled ? "On" : "Off"));
	console.log("Position: " + this.position.x + " " + this.position.y + " " + this.position.z + " " + this.position.w);
	console.log("Ambient: " + printRGBA(this.ambient));
	console.log("Diffuse: " + printRGBA(this.diffuse));
	console.log("Specular: " + printRGBA(this.specular));

}







