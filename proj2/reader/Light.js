/**
 * Light
 * @constructor
 * @param scene CGFscene,
 * @param an Shader light array index.
 * @param id light id
 */

function Light(scene, an, id) {
	console.log(an);
    CGFlight.call(this, scene, an);
    this.name = id;
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;


