/**
 * Texture
 * @constructor
 * @param scene CFGscene
 * @param path to file of texture
 * @param id identification of the texture
 */
function Texture(scene, path, id) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.amplifyFactor = {s: 1,
                          t: 1};
};

Texture.prototype = Object.create(CGFtexture.prototype);
Texture.prototype.constructor = Texture;

/**
 * Texture amplify factors
 * @param s 
 * @param t
 */
Texture.prototype.setAmplifyFactor = function(s, t) {
    this.amplifyFactor.s = s;
    this.amplifyFactor.t = t;
}