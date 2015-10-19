/**
 * Light
 * @constructor
 * @param scene CGFscene,
 * @param an id - number of position
 * @param id name of the light
 */

function Light(scene, an, id) {
    CGFlight.call(this, scene, an);
    this.id = id;
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;