/**
 * MyTerrain
 * @constructor
 */
function MyTerrain(scene,texture, heightMap) {
    CGFobject.call(this, scene);
    this.texture = texture;
    this.heightMap = heightMap;
    this.initBuffers(scene);
};

MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;

MyTerrain.prototype.initBuffers=function (scene) {
  CGFobject.call(this, scene);
  this.materialTerrain = new CGFappearance(scene);
  this.materialTerrain.setAmbient(0.5,0.5,0.5,1);
  this.materialTerrain.setDiffuse(0.5,0.5,0.5,1);
  this.materialTerrain.setSpecular(0.5,0.5,0.5,1);
  this.materialTerrain.setShininess(1);
  this.textureTerrain = new CGFtexture(scene, this.texture);
  this.heightmapTerrain = new CGFtexture(scene, this.heightMap);
  this.materialTerrain.setTexture(this.textureTerrain);

  this.myShader = new CGFshader(scene.gl, "shaders/myShader.vert", "shaders/myShader.frag");
  this.myShader.setUniformsValues({uSampler2: 1});
  this.myShader.setUniformsValues({scale: 0.5});

  this.nonScaledTexCoords = [
  0, this.y1-this.y2,
  this.x2-this.x1, this.y1-this.y2,
  this.x2-this.x1, 0,
  0, 0
  ];

  this.texCoords = this.nonScaledTexCoords.slice(0);

  this.plane = new MyPlane(scene, 200);
}

MyTerrain.prototype.scaleTexCoords = function(ampS, ampT) {
  for (var i = 0; i < this.texCoords.length; i += 2) {
    this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
    this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
  }

  this.updateTexCoordsGLBuffers();
}

MyTerrain.prototype.display = function() {
  this.materialTerrain.apply();
  this.scene.setActiveShader(this.myShader);

  this.scene.pushMatrix();

  this.heightmapTerrain.bind(1);
  this.plane.display();
  this.scene.setActiveShader(this.scene.defaultShader);

  this.scene.popMatrix();
}
