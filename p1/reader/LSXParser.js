/**
 * LSXParser
 * @constructor
 * @param filename of the LSX file that contains the data to draw the scene 
 * @param scene 
 */
function LSXParser(filename, scene) {
    this.loadedOK = null;

    this.scene = scene;
    scene.graph = this;

    this.path = "scenes/" + filename;
    this.reader = new MyReaderLSX();
    this.reader.open(this.path, this);
    this.texture_path = this.path.substring(0, this.path.lastIndexOf("/")) + "/";
    console.log("LSXParser for " + this.path + ".");

    // Scene graph data
    this.initials = new Initials();
    this.illumination = new Illumination();
    this.lights = [];
    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.root_id = null;
    this.nodes = [];
}
/**
 * LSXParser
 * Calls all the functions to parse the LSX file
 */
LSXParser.prototype.onXMLReady = function() {
    console.log("LSX loaded successfully.");

    var rootElement = this.reader.xmlDoc.documentElement;

    console.log("*******INITIALS*******");

    var error = this.parseInitials(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******ILLUMINATION*******");

    error = this.parseIllumination(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******LIGHTS*******");

    error = this.parseLights(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******TEXTURES*******");

    error = this.parseTextures(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******MATERIALS*******");

    error = this.parseMaterials(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******LEAVES*******");

    error = this.parseLeaves(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("*******NODES*******");

    error = this.parseNodes(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    console.log("**************");

    this.loadedOK = true;
    this.scene.onGraphLoaded();
};

LSXParser.prototype.onXMLError = function(message) {
    console.error("LSX loading error: " + message);
    this.loadedOK = false;
};

LSXParser.prototype.parseInitials = function(rootElement) {
    //Parse Tag INITIALS
    var initials_list = rootElement.getElementsByTagName('INITIALS')[0];
    if (initials_list == null) return "<INITIALS> element is missing.";

    //Parse Tag Frustum
    var frustum = initials_list.getElementsByTagName('frustum')[0];
    if (frustum == null) return "<frustum> element is missing";

    this.initials.frustum.near = this.reader.getFloat(frustum, 'near');
    this.initials.frustum.far = this.reader.getFloat(frustum, 'far');

    //Parse Tag Translation
    var translation = initials_list.getElementsByTagName('translation')[0];
    if (translation == null) return "<translation> element is missing";

    this.initials.translation.x = this.reader.getFloat(translation, 'x');
    this.initials.translation.y = this.reader.getFloat(translation, 'y');
    this.initials.translation.z = this.reader.getFloat(translation, 'z');

    //Parse Tag Rotation
    var rotations = initials_list.getElementsByTagName('rotation');
    if (rotations.length != 3 || rotations == null) return "Needs 3 <rotation> elements";

    for (i = 0; i < rotations.length; i++) {
        var rot = {
            axis: null,
            angle: null
        };
        rot.axis = this.reader.getItem(rotations[i], 'axis', ['x', 'y', 'z']);
        rot.angle = this.reader.getFloat(rotations[i], 'angle');
        this.initials.rotations.push(rot);
    }

    //Parse Tag Scale
    var scale = initials_list.getElementsByTagName('scale')[0];
    if (scale == null) return "<scale> element is missing";
    this.initials.scale.sx = this.reader.getFloat(scale, 'sx');
    this.initials.scale.sy = this.reader.getFloat(scale, 'sy');
    this.initials.scale.sz = this.reader.getFloat(scale, 'sz');

    //Parse Tag Reference length
    var r_length = initials_list.getElementsByTagName('reference')[0];
    if (r_length == null) return "<reference> element is missing";

    this.initials.reference = this.reader.getFloat(r_length, 'length');

    this.initials.print();

    return null;
};

LSXParser.prototype.parseIllumination = function(rootElement) {
   //Parse Tag ILLUMINATION
    var illumination_list = rootElement.getElementsByTagName('ILLUMINATION')[0];
    if (illumination_list == null) return "<ILLUMINATION> element is missing.";

    //Parse Tag Ambient
    var ambient = illumination_list.getElementsByTagName('ambient')[0];
    if (ambient == null) return "<ambient> element is missing";

    this.illumination.ambient = this.reader.getRGBA(ambient);

    
	//Parse Tag Background
    var background = illumination_list.getElementsByTagName('background')[0];
    if (background == null) return "<background> element is missing";

    this.illumination.background = this.reader.getRGBA(background);

    this.illumination.print();

	
    return null;
};

LSXParser.prototype.parseLights = function(rootElement) {
   
    //Parse Tag LIGHTS
    var lights_list = rootElement.getElementsByTagName('LIGHTS')[0];
    if (lights_list == null) return "<LIGHTS> element is missing.";
    //Parse Tag LIGHT (its possible to have multiple lights)
    var lights = lights_list.getElementsByTagName('LIGHT');
    for (i = 0; i < lights.length; i++) {
        var light = new Light(this.reader.getString(lights[i], 'id'));
        light.enabled = this.reader.getBoolean(lights[i].getElementsByTagName('enable')[0], 'value');
        light.ambient = this.reader.getRGBA(lights[i].getElementsByTagName('ambient')[0]);
        light.diffuse = this.reader.getRGBA(lights[i].getElementsByTagName('diffuse')[0]);
        light.specular = this.reader.getRGBA(lights[i].getElementsByTagName('specular')[0]);

        var pos = lights[i].getElementsByTagName('position')[0];
        light.position.x = this.reader.getFloat(pos, 'x');
        light.position.y = this.reader.getFloat(pos, 'y');
        light.position.z = this.reader.getFloat(pos, 'z');
        light.position.w = this.reader.getFloat(pos, 'w');

        light.print();
        this.lights.push(light);
    }
    console.log('AAAAAAAAA');
    console.log(lights);
    return null;


};

LSXParser.prototype.parseTextures = function(rootElement) {
    //To allow passing the relative path of the textures in the LSX file
    texture_path = this.path.substring(0, this.path.lastIndexOf("/")) + "/";
    var textures_list = rootElement.getElementsByTagName('TEXTURES')[0];
    if (textures_list == null) return "<TEXTURES> element is missing.";
    
    var textures = textures_list.getElementsByTagName('TEXTURE');
    for (i = 0; i < textures.length; i++) {
       
        var relPath = textures[i].getElementsByTagName('file')[0].getAttribute('path');
        var path = texture_path + relPath;
        var texture = new Texture(this.scene, textures[i].getAttribute('id'), path);

        var ampliST = textures[i].getElementsByTagName('amplif_factor')[0];
        texture.amplif_factor.s = this.reader.getFloat(ampliST, 's');
        texture.amplif_factor.t = this.reader.getFloat(ampliST, 't');

        texture.print();
        this.textures.push(texture);
    }

    return null;
};

LSXParser.prototype.parseMaterials = function(rootElement) {
    var materials_list = rootElement.getElementsByTagName('MATERIALS')[0];
    if (materials_list == null) return "<MATERIALS> element is missing.";

    var materials = materials_list.getElementsByTagName('MATERIAL');
    for (i = 0; i < materials.length; i++) {
        var newMat = new Material(this.scene, materials[i].getAttribute('id'));
        
        ambient = this.reader.getRGBA(materials[i].getElementsByTagName('ambient')[0]);
        diffuse = this.reader.getRGBA(materials[i].getElementsByTagName('diffuse')[0]);
        specular = this.reader.getRGBA(materials[i].getElementsByTagName('specular')[0]);
        emission = this.reader.getRGBA(materials[i].getElementsByTagName('emission')[0]);
        shininess = this.reader.getFloat(materials[i].getElementsByTagName('shininess')[0], 'value');


        newMat.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
        newMat.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
        newMat.setSpecular(specular.r, specular.g, specular.b, specular.a);
        newMat.setEmission(emission.r, emission.g, emission.b, emission.a);
        newMat.setShininess(shininess);


        newMat.print();
        this.materials.push(newMat);
    }

    return null;
};

LSXParser.prototype.parseLeaves = function(rootElement) {
    var leaves_list = rootElement.getElementsByTagName('LEAVES')[0];
    if (leaves_list == null) return "<LEAVES> element is missing.";

    var leaves = leaves_list.getElementsByTagName('LEAF');
    for (i = 0; i < leaves.length; i++) {
        var leaf = new Leaf(leaves[i].getAttribute('id'));
        leaf.type = this.reader.getItem(leaves[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);

        var args_aux = leaves[i].getAttribute('args').split(" ");
        for (var j = 0; j < args_aux.length; j++) {
            if (args_aux[j] === ""){
                args_aux.splice(j, 1);
                --j;
            }
        }
        switch (leaf.type) {
            case "rectangle":
                if (args_aux.length != 4)
                    return "Invalid number of arguments for type 'rectangle'";

            for (var j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            case "cylinder":
                if (args_aux.length != 5)
                    return "Invalid number of arguments for type 'cylinder'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseFloat(args_aux[1]));
                leaf.args.push(parseFloat(args_aux[2]));
                leaf.args.push(parseInt(args_aux[3]));
                leaf.args.push(parseInt(args_aux[4]));
                break;
            case "sphere":
                if (args_aux.length != 3)
                    return "Invalid number of arguments for type 'sphere'";

                leaf.args.push(parseFloat(args_aux[0]));
                leaf.args.push(parseInt(args_aux[1]));
                leaf.args.push(parseInt(args_aux[2]));
                break;
            case "triangle":
                if (args_aux.length != 9)
                    return "Invalid number of arguments for type 'triangle'";

                for (j = 0; j < args_aux.length; j++)
                    leaf.args.push(parseFloat(args_aux[j]));

                break;
            default:
                return "Type " + "\"" + leaf.type + "\" not valid.";
        }

        leaf.print();
        this.leaves.push(leaf);
    }

    return null;
};

LSXParser.prototype.parseNodes = function(rootElement) {
    var nodes_list = rootElement.getElementsByTagName('NODES')[0];
    if (nodes_list == null) return "<NODES> element is missing.";

    var root_node = nodes_list.getElementsByTagName('ROOT')[0];
    this.root_id = this.reader.getString(root_node, 'id');
    console.log("ROOT Node: " + this.root_id);

    var nodes = nodes_list.getElementsByTagName('NODE');

    for (i = 0; i < nodes.length; i++) {
        var node = new Node(nodes[i].getAttribute('id'));
        node.material = this.reader.getString(nodes[i].getElementsByTagName('MATERIAL')[0], 'id');
        node.texture = this.reader.getString(nodes[i].getElementsByTagName('TEXTURE')[0], 'id');

        // Transforms
        var children = nodes[i].children;
        for (j = 0; j < children.length; j++) {
            switch (children[j].tagName) {
                case "TRANSLATION":
                    var trans = [];
                    trans.push(this.reader.getFloat(children[j], "x"));
                    trans.push(this.reader.getFloat(children[j], "y"));
                    trans.push(this.reader.getFloat(children[j], "z"));
                    // console.log("trans: " + trans);
                    mat4.translate(node.matrix, node.matrix, trans);
                    break;
                case "SCALE":
                    var scale = [];
                    scale.push(this.reader.getFloat(children[j], "sx"));
                    scale.push(this.reader.getFloat(children[j], "sy"));
                    scale.push(this.reader.getFloat(children[j], "sz"));
                    // console.log("scale: " + scale);
                    mat4.scale(node.matrix, node.matrix, scale);
                    break;
                case "ROTATION":
                    var axis = this.reader.getItem(children[j], "axis", ["x", "y", "z"]);
                    var angle = this.reader.getFloat(children[j], "angle") * deg2rad;
                    var rot = [0, 0, 0];

                    // console.log("rot: " + axis + " " + angle + " ");
                    rot[["x", "y", "z"].indexOf(axis)] = 1;
                    mat4.rotate(node.matrix, node.matrix, angle, rot);
                    break;
            }
        }

        //Descendants
        var desc = nodes[i].getElementsByTagName('DESCENDANTS')[0];
        if (desc == null) return "No <DESCENDANTS> tag found";

        var d_list = desc.getElementsByTagName('DESCENDANT');
        if (d_list.length < 1) return "Need at least 1 <DESCENDANT>";

        for (j = 0; j < d_list.length; j++) {
            node.descendants.push(d_list[j].getAttribute('id'));
        }

        node.print();
        this.nodes.push(node);
    }

    return null;
};

LSXParser.prototype.findNode = function(id) {
    for (i = 0; i < this.nodes.length; i++)
        if (this.nodes[i].id == id) return this.nodes[i];

    return null;
};


