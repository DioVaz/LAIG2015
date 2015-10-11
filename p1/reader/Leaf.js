var Leaf = function(newId, newType){
	this.type = newType;
	this.id = newId;

};


Leaf.prototype = Object.create(Leaf.prototype);
Leaf.prototype.constructor = Leaf;

Leaf.prototype.setId = function(newId){
	this.id = newId;
}