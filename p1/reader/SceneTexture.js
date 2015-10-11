function SceneTexture(scene, url, id) {
    CGFtexture.call(this, scene, url);
    this.id = id;
    this.amplifyFactor = {s: 1,
                          t: 1};
};

SceneTexture.prototype = Object.create(CGFtexture.prototype);
SceneTexture.prototype.constructor = SceneTexture;

SceneTexture.prototype.setAmplifyFactor = function(s, t) {
    this.amplifyFactor.s = s;
    this.amplifyFactor.t = t;
}