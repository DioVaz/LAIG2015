/*
 * LSXReader extends CGFXMLreader
*/
function LSXReader() {
    CGFXMLreader.call(this);
}

LSXReader.prototype = Object.create(CGFXMLreader.prototype);
LSXReader.prototype.constructor = LSXReader;

/*
 * Reads elemet from LSX of type r,g,b,a
*/
LSXReader.prototype.getRGBA = function(color) {
    
    if (color == null) {
        console.error("color is null");
        return null;
    }
    var rgba = [null, null, null, null];

    rgba[0] = color.getAttribute("r");
    if (rgba[0] == null) {
        console.error("R is null");
        return null;
    }

    rgba[1] = color.getAttribute("g");
    if (rgba[1] == null) {
        console.error("G is null");
        return null;
    }
    
    rgba[2] = color.getAttribute("b");
    if (rgba[2] == null) {
        console.error("B is null");
        return null;
    }

    rgba[3] = color.getAttribute("a");
    if (rgba[3] == null) {
        console.error("A is null");
        return null;
    }

    return rgba;
}

/*
 * Process element with various floats attributes
 */
LSXReader.prototype.getArrayOfFloats = function(element, name, num) {
  
    if (element == null) {
        console.error("Element is null");
        return null;
    }
    if (name == null) {
        console.error("Name is null");
        return null;
    }
    var attribute = element.getAttribute(name);
    if (attribute == null) {
        console.error("Attribute null for" + name);
        return null;
    }

    var nFloats = attribute.match(/\S+/g);
    
    if (nFloats.length != num) {
        console.error("Number of attributes is wrong for " + name);
        return null;
    }

    var makeArray = new Array();
    for (var i = 0; i < nFloats.length; i++)
    {
        var value = parseFloat(nFloats[i]);
        if (isNaN(value)) {
            console.error("Value is not float for" + name);
            return null;       
        }
        makeArray.push(value);
    }
    return makeArray;
}
