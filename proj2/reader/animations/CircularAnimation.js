/**
 * CircularAnimation
 * @constructor
 * @param id of animation
 * @param timeSpan duration of animation
 * @param center position of center of the circular motion
 * @param radius in radians of the circular motion
 * @param startAngle start angle in radians of the circular motion
 * @param rotAngle angle of rotation in radians of the circular motion
 */
function CircularAnimation(id, timeSpan, center, radius, startAngle, rotAng) {
    Animation.call(this, id, timeSpan, "circular");
    this.timeSpan = timeSpan;
    this.center = center;
    this.radius = radius;
    this.startAngle = startAngle;
    this.rotAngle = rotAng;
    this.animateTransformations = mat4.create();
    this.dw = rotAng/timeSpan;
    this.init();
   

}

//CircularAnimation extends Animation
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function() {
	mat4.identity(this.animateTransformations);
	 
	mat4.rotateY(this.animateTransformations, this.animateTransformations, this.startAngle);
	mat4.translate(this.animateTransformations, this.animateTransformations,
				   vec3.fromValues(0, 0, this.radius));
	mat4.rotateY(this.animateTransformations, this.animateTransformations,
				this.rotAngle > 0 ? Math.PI / 2 : - Math.PI / 2);
}


CircularAnimation.prototype.restart = function(){
    this.currentAng = this.startAngle;
    this.animateTransformations = mat4.create();
    mat4.identity(this.animateTransformations);
   // Animation.restart();
}

CircularAnimation.prototype.update = function(time){
 	time = Math.min(time, this.timeSpan);
	
	var transformation = mat4.create();
	mat4.identity(transformation);

	if (time < 0)
		return transformation;
	
	var rot = this.dw*time;

	mat4.translate(transformation, transformation, this.center);

	mat4.rotateY(transformation, transformation, rot);
	mat4.multiply(transformation, transformation, this.animateTransformations);

	return transformation;

}


