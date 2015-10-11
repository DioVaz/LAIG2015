/**
 * MyCilinder / MyCone (come on, we can do a cone with this!)
 * @constructor
 */
 function MyCylinder(scene, height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

	this.height=height;
	this.bRadius = bRadius;
	this.tRadius = tRadius;

	this.bBase = new MyCircle(scene,slices);
	this.tBase = new MyCircle(scene,slices);
	this.body = new MyCylinderBody(scene,bRadius,tRadius,stacks,slices);

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display = function() {
	/* Bottom circle */
	this.scene.pushMatrix();
		this.scene.scale(this.bRadius,this.bRadius,1);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.bBase.display();
	this.scene.popMatrix();

	/* Top circle */
	this.scene.pushMatrix();
		this.scene.translate(0,0,this.height);
		this.scene.scale(this.tRadius,this.tRadius,1);
		this.tBase.display();
	this.scene.popMatrix();

	/* Body */
	this.scene.pushMatrix();
		this.scene.scale(1,1,this.height);
		this.body.display();
	this.scene.popMatrix();
}