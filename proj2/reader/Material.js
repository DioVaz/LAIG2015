/**
 * Material
 * @constructor
 * @param scene CFGscene
 * @param id identification of the material
 */
function Material(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}

Material.prototype = Object.create(CGFappearance.prototype);
Material.prototype.constructor = Material;