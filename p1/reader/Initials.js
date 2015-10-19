/**
 * Initials
 * @constructor
 */
function Initials() {
    this.frustum = {near: 0, far: 0};

    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
    
    this.referenceLength = 0;
};

Initials.prototype = Object.create(Object.prototype);
Initials.prototype.constructor = Initials;