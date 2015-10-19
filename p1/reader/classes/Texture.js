/**
 * Texture
 * @constructor
 * @param id identification of the texture
 */
function Texture(scene, id, path) {
    this.id = id;
    this.path = path;
    this.amplif_factor = {
        s: 0.0,
        t: 0.0
    };
    CGFtexture.call(this, scene, path);
}



Texture.prototype = Object.create(CGFtexture.prototype);
Texture.prototype.constructor = Texture;



Texture.prototype = Object.create(Texture.prototype);
Texture.prototype.constructor = Texture;

/**
 * Prints the information of the texture
 */
Texture.prototype.print = function(){

	console.log("Texture id: " + this.id);
	console.log("Path: " + this.path);
	console.log("Amplif Factor: " + "(s:" + this.amplif_factor.s + ", t:" + this.amplif_factor.t + ")");

}