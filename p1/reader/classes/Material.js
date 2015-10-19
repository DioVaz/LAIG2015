/**
 * Material
 * @constructor
 * @param id identification of the material
 */
function Material(scene, id) {
    
    CGFappearance.call(this, scene);
    this.id = id;
    this.shininess = 0.0;
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
    this.emission = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0
    };

}

Material.prototype = Object.create(CGFappearance.prototype);
Material.prototype.constructor = Material;


/**
 * Prints the information of the material
 */
Material.prototype.print = function(){
        console.log("Material id: " + this.id);
        console.log("Shininess: " + this.shininess);
        console.log("Ambient: " + printRGBA(this.ambient));
        console.log("Diffuse: " + printRGBA(this.diffuse));
        console.log("Specular: " + printRGBA(this.specular));
        console.log("Emission: " + printRGBA(this.emission));
}


