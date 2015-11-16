/**
 * MyTerrain
 * @constructor
 */
function MyTerrain(scene,texture, heightMap) {
    CGFobject.call(this, scene);
    this.texture = texture;
    this.heightMap = heightMap;
    this.initBuffers();
};

MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;

MyTerrain.prototype.display = function() {
  this.scene.pushMatrix();
  this.scene.appearance = new CGFappearance(this);
  this.scene.appearance.setAmbient(0.3, 0.3, 0.3, 1);
  this.scene.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
  this.scene.appearance.setSpecular(0.0, 0.0, 0.0, 1);
  this.scene.appearance.setShininess(120);
  this.scene.texture = new CGFtexture(this, texture);
  this.scene.appearance.setTexture(this.texture);
  this.scene.appearance.setTextureWrap ('REPEAT', 'REPEAT');
  //this.scene.scale(-1,1,1);
  //this.scene.rotate(0,1,0,Math.PI);
  //CGFnurbsObject.prototype.display.call(this);
  this.scene.popMatrix();
}
