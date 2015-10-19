/**
 * Node
 * @constructor
 * @param id identification of the node
 */
function Node(id) {
   this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = mat4.create();

    this.descendants = [];

}

Node.prototype = Object.create(Node.prototype);
Node.prototype.constructor = Node;

/**
 * Prints the information of the node
 */
Node.prototype.print = function(){

        console.log("Node id: " + this.id);
        console.log("Material: " + this.material);
        console.log("Texture: " + this.texture);
        console.log("Matrix: " + this.matrix);
        console.log("Descendants: " + this.descendants);
	
}