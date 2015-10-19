/**
 * Illumination
 * @constructor
 */
function Illumination() {
    this.ambient = {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
    };
    this.background = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
    };

}

Illumination.prototype = Object.create(Illumination.prototype);
Illumination.prototype.constructor = Illumination;
/**
 * Prints the information of the illumination
 */

Illumination.prototype.print = function () {
  
	console.log("Ambient: " + printRGBA(this.ambient));
	console.log("Background: " + printRGBA(this.background));

}

