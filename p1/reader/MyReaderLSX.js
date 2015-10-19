/**
 * MyReaderLSX
 * @constructor
 * @param filename of the LSX file that contains the data to draw the scene 
 * @param scene 
 */
function MyReaderLSX() {
    CGFXMLreader.call(this);
}

MyReaderLSX.prototype = Object.create(CGFXMLreader.prototype);
MyReaderLSX.prototype.constructor = MyReaderLSX;


MyReaderLSX.prototype.getRGBA = function(element) {
    var color = {};
    

    color.r = this.getFloat(element, 'r');
     if (color.r == null) {
        console.error("value is null for r component of rgba in element ", element);
        return null;
    }
    color.g = this.getFloat(element, 'g');
    if (color.g == null) {
        console.error("value is null for g component of rgba in element ", element);
        return null;
    }
    color.b = this.getFloat(element, 'b');
    if (color.b == null) {
        console.error("value is null for b component of rgba in element ", element);
        return null;
    }
    color.a = this.getFloat(element, 'a');
    if (color.a == null) {
        console.error("value is null for a component of rgba in element ", element);
        return null;
    }
    return color;
};



var printRGBA = function(c) {
    return "(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
};