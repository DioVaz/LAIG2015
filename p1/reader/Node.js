function Node(newId) {
    this.id = newId;
    this.material = "null";
    this.texture = "clear";
    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
    this.children = new Array();
}



Node.prototype = Object.create(Node.prototype);
Node.prototype.constructor = Node;


Node.prototype.setId = function(newId){
	this.id = newId;
}

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

Node.prototype.setMaterial = function(material) {
    this.material = material;
}

Node.prototype.setTexture = function(texture) {
     this.texture = texture;
}

Node.prototype.addChildren = function(childs) {
   this.children = childs;
}

Node.prototype.rotateX = function(rad) {
    mat4.rotateX(this.localTransformations, this.localTransformations, rad);
}
Node.prototype.rotateY = function(rad) {
    mat4.rotateY(this.localTransformations, this.localTransformations, rad);
}
Node.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.localTransformations, this.localTransformations, rad);
}

Node.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.localTransformations, this.localTransformations, vec3.fromValues(sx,sy,sz));
}

Node.prototype.translate = function(x, y, z) {
    mat4.translate(this.localTransformations, this.localTransformations, vec3.fromValues(x, y, z));
}


