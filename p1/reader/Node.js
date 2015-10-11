var Node = function(newId, transformationsMatrix){
	this.children = new Array();
	this.localTransformations = transformationsMatrix;
	this.id = newId;

};

Node.prototype.setId = function(newId){
	this.id = newId;
}

Node.prototype = Object.create(Node.prototype);
Node.prototype.constructor = Node;