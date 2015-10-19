/**
 * Leaf
 * @constructor
 * @param id identification of the leaf
 */
function Leaf(id) {
	this.id = id;
    this.type = "";
    this.args = [];


}

Leaf.prototype = Object.create(Leaf.prototype);
Leaf.prototype.constructor = Leaf;

/**
 * Prints the information of the leaf
 */
Leaf.prototype.print = function(){
  
	console.log("Leaf id: " + this.id);
	console.log("Type: " + this.type);
	console.log("Args: " + this.args);

	
}