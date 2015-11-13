/**
 * Animation
 * @constructor
 * @param id of animation
 * @param timeSpan duration of animation in seconds
 @ @param type type of animations ("circular" or "linear")
 */
function Animation(id, timeSpan, type) {
   this.id = id;
   this.timeSpan = timeSpan;
   this.type = type;

   this.currentTime = 0;
}

Animation.prototype = Object.create(Animation.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.restart = function(){
    this.currentTime = 0;
}