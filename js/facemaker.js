'use strict';

var FaceMaker = (function() {

	var FM = function(options) {
		if(!!options) {
			this.options = $.extend({}, this.defaults, this.options);
		} else {
			this.options = $.extend({}, this.defaults);
		}

		console.log("FaceMaker loading");

		this.new_face_button = $(this.options.new_face);
		this.download_face_button = $(this.options.download_face);

		this.editor = $(this.options.editor);
		this.preview = $(this.options.preview)[0];

		if(!this.editor || !this.preview) {
			throw "Unable to initialize elements";
		}

		this.face = null;
		this.rendering = false;

		this.init_preview();
		this.init_editor();
		this.init_buttons();
	};

	FM.prototype.init_buttons = function() {
		this.new_face_button.click(this.new_face.bind(this));
		this.download_face_button.click(this.download_face.bind(this));
	}

	FM.prototype.new_face = function() { 
		this.rendering = false;

		var new_id;

		for(new_id = ''; new_id.length < 32;) 
			new_id += Math.random().toString(36).substr(2, 1)

		this.face = {};
		this.face.description = {
			id: new_id,
			title: "Untitled Watchface"
		};
		this.face.watchface = [];

		this.face.images = [];
		this.face.fonts = [];

		this.rendering = true;
		this.render();
	}
	
	FM.prototype.download_face = function() {
		this.download_zip_file();
	}

	FM.prototype.defaults = {
		editor: '#editor',
		preview: 'canvas#preview',
		new_face: "#new_face",
		download_face: "#download_face",
		examples: []
	};

	FM.prototype.render = function() {
		var fm = this,
		c = fm.ctx;

		if(!fm.rendering) {
			return;
		}

		c.imageSmoothingEnabled = true;

		c.fillStyle = "rgb(255,255,255)";
		c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

        //For the moment, we use a 320px radius circle for clipping, per Moto 360
        c.save();
        c.beginPath();
        c.arc(fm.canvas_width / 2, fm.canvas_height / 2, 160, 0, 2*Math.PI);
        c.closePath();
        c.clip();

        //Blank the watch face
        c.fillStyle = "rgb(0,0,0)";
        c.lineWidth = 0;
        c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

        for(var i in fm.face.watchface) {
        	fm.draw_layer(fm.face.watchface[i]);
        }

        //Apply the clip, the mask off the rest of it
        c.restore();

        c.fillStyle = "rgb(255,255,255)"
        c.fillRect(0, 290, 320, 320);
        
        requestAnimationFrame(fm.render.bind(this));
      };

      FM.prototype.draw_layer = function(layer) {
      	var fm = this;

      	switch(layer.type) {
      		case 'text':
      		fm._draw_text(layer);
      		break;
      		case 'shape':
      		fm._draw_shape(layer);
      		break;
      		case 'image':
      		fm._draw_image(layer);
      		break;
      		default:
      		throw layer.type + " is not a valid layer type";
      	}
      };  

      FM.prototype._draw_image = function(layer) {
      	var fm = this,
      			image_hash = layer.hash,
      			image = fm.face.images[image_hash].img,

		      	x = fm.parseInt(layer.x),
		      	y = fm.parseInt(layer.y),
		      	w = fm.parseInt(layer.width),
		      	h = fm.parseInt(layer.height);

      	fm.ctx.drawImage(image, x, y, w, h);
      }

      FM.prototype._draw_shape = function(layer) {
      	var fm = this,
      	c = fm.ctx,
      	x = fm.parseInt(layer.x),
      	y = fm.parseInt(layer.y),
      	radius = fm.parseInt(layer.radius);
    /*
     * Some Notes, per Reverse Engineering
     * shape_opt 0 - Fill, 1 - Stroke
     */
     
     if(layer.shape_opt) {
     	c.strokeStyle = fm._parseColor(layer.color, layer.opacity);
     } else {
     	c.fillStyle = fm._parseColor(layer.color, layer.opacity);
     }

     c.lineWidth = parseInt(layer.stroke_size) / 2;

     switch(layer.shape_type) {
     	case fm.ShapeTypes.circle:
     	c.beginPath();
     	c.arc(x, y, radius, 0, 2*Math.PI);

     	if(layer.shape_opt === 0) {
     		c.fill();
     	} else {
     		c.stroke();
     	}

     	c.closePath();

     	break;
     	case fm.ShapeTypes.square:
     	case fm.ShapeTypes.line:
        //As far as I can tell, a line is just a rect, and a square is really a rect
        if(layer.shape_opt === 0) {
        	c.fillRect(x, y, parseInt(layer.width), parseInt(layer.height));
        } else {
        	c.strokeRect(x, y, parseInt(layer.width), parseInt(layer.height));
        }
        break;

        case fm.ShapeTypes.triangle:
        //Fun little hack to skip duplication of code
        layer.sides = "3";
        case fm.ShapeTypes.polygon:
        var num_sides = parseInt(layer.sides),
        angle = 2 * Math.PI / num_sides;
        
        var rotation = 90 * Math.PI / 180;

        c.beginPath();
        
        c.moveTo(x + radius * Math.cos(angle + rotation), y + radius * Math.sin(angle + rotation));

        for( var i = 0; i <= num_sides; i++) {
        	c.lineTo(x + radius * Math.cos(i * angle + rotation), y + radius * Math.sin(i * angle + rotation));
        }
        
        c.closePath();

        if(layer.shape_opt) {
        	c.stroke();
        } else {
        	c.fill();
        }
        break;
        default: break;
      }
    }

    FM.prototype.ShapeTypes = {
    	circle: 0,
    	square: 1,
    	polygon: 2,
    	line: 3,
    	triangle: 4
    };

    FM.prototype.ImageAlignment = {
    	top_left: 0,
    	top_center: 1,
    	top_right: 2,
    	center_left: 3,
    	center: 4,
    	center_right: 5,
    	bottom_left: 6,
    	bottom_center: 7,
    	bottom_right: 8
    };

    FM.prototype.Alignment = {
    	left: 0,
    	center: 1,
    	right: 2
    };

    FM.prototype.Transform = {
    	uppercase: 1,
    	lowercase: 2
    };

    FM.prototype._draw_text = function(layer) {
    	var fm = this,
		    	c = fm.ctx,
		    	rotation = fm.parseInt(layer.r),
		    	x = fm.parseInt(layer.x),
		    	y = fm.parseInt(layer.y),
		    	text = fm.parse(layer.text);

    	if(layer.transform == fm.Transform.uppercase) {
    		text = text.toUpperCase();
    	} else if (layer.transform == fm.Transform.lowercase) {
    		text = text.toLowerCase();
    	}

    	c.textAlign = fm._parseAlignment(layer.alignment);

    	c.save();
    	c.translate(x, y);
    	c.rotate(rotation * (Math.PI / 180));

    	c.fillStyle = fm._parseColor(layer.color, layer.opacity);


    	c.font = layer.size + "px " + "Arial";
    	c.fillText(text, 0, 0);

    	c.restore();
    };

    FM.prototype._parseColor = function(color_str, opacity) {
    	var color = parseInt(color_str),
    	r = color >> 16 & 0xFF,
    	g = color >>  8 & 0xFF,
    	b = color       & 0xFF,
    	o = this.parseInt(opacity) / 100;

    	return "rgba(" + r + "," + g + "," + b + "," + o + ")";
    };

    FM.prototype._parseAlignment = function(alignment) {
    	switch(alignment) {
    		case fm.Alignment.center:
    		return 'center';
    		case fm.Alignment.right:
    		return 'right';
    		case fm.Alignment.left:
    		default:
    		return 'left';
    	}
    };

    FM.prototype.ReplaceVariables = function(variable) {

    };


    FM.prototype.init_preview = function() {
    	var fm = this;

    	fm.ctx = fm.preview.getContext("2d");

    	fm.canvas_width = fm.preview.width;
    	fm.canvas_height = fm.preview.height;

    	fm.ctx.fillStyle = 'rgb(255,255,255)';
    	fm.ctx.fillRect(0, 0, fm.preview.width, fm.preview.height);
    };

    FM.prototype.load_face_ajax = function(href) {
    	var fm = this;

    	JSZipUtils.getBinaryContent(href, function(err, data) {
    		if(err) throw err;

    		fm.load_face(data);
    	});
    };

    FM.prototype.load_face = function(file) {
   		var zip = new JSZip(file);

   		fm._handle_zip(zip);

   		fm.rendering = true;
   		requestAnimationFrame(fm.render.bind(fm));
    }

    FM.prototype._handle_zip = function(zip_file) {
    	var f_watchface = zip_file.file("watchface.json"),
    	f_description = zip_file.file("description.json"),
    	f_preview = zip_file.file("preview.png"),
    	f_fonts = [],
    	f_images = [],
    	face = {
    		images: {},
    		fonts: {}
    	};

    	for(var filename in zip_file.files) {
    		console.log("Loading file " + filename);

    		var file = zip_file.file(filename);

    		if(filename === 'watchface.json') {
    			face.watchface = JSON.parse(file.asText());
    		} else if (filename === 'description.json') {
    			face.description = JSON.parse(file.asText());
    		} else if (filename === 'preview.png') {
    			var image = {
    				file: file,
    				img: new Image()
    			};

    			image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());
    			face.preview_image = image;
    		} else if (filename.indexOf('images/') === 0) {
    			if(filename !== 'images/') {
    				var image_hash = filename.substring(7),
    				image = {
    					file: file,
    					img: new Image()
    				};

    				image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());
    				image.img.className = 'preview_image';

    				face.images[image_hash] = image;
    			}
    		} else if (filename.indexOf('fonts/') === 0) {
    			if(filename !== 'fonts/') {
    				var font_name = filename.substring(6);
    				face.fonts[font_name] = file;
    			}
    		} else {
    			console.log('File ' + filename + ' is unknown');
    		}
    	}

    	this.face = face;
    };

    FM.prototype._create_preview_image = function() {
    	//Copy the canvas from 40,40 to 360, 340 to a PNG image
    	var fm = this;

    	return fm.preview.toDataURL().split(",")[1];
    };

    FM.prototype._create_zip = function() {
    	//We need to create a ZIP file
    	// images/<hash>
    	// fonts/<filename>
    	// watchface.json
    	// preview.png
    	// description.json
    	var fm = this,
    			zip = new JSZip(),
    			images_folder = zip.folder("images"),
    			fonts_folder = zip.folder("fonts");

    	//Export all the fonts
    	for(var font_filename in fm.face.fonts) {
    		if(fm.face.fonts.hasOwnProperty(font_filename)) {
    			fonts_folder.file(font_filename, fm.face.fonts[font_filename].asArrayBuffer());
    		}
    	}

    	//Export all the images
    	for(var image_hash in fm.face.images) {
    		if(fm.face.images.hasOwnProperty(image_hash)) {
    			images_folder.file(image_hash, fm.face.images[image_hash].file.asArrayBuffer());
    		}
    	}

    	//Export the data
    	zip.file("watchface.json", JSON.stringify(fm.face.watchface));
    	zip.file("description.json", JSON.stringify(fm.face.description));
    	zip.file("preview.png", fm._create_preview_image(), {base64: true});

    	return zip;
    };

    FM.prototype.download_zip_file = function() {
    	var fm = this,
    			zip = fm._create_zip(),
    			zip_blob = zip.generate({type:"blob"});

    	saveAs(zip_blob, fm.face_filename());
    };

    FM.prototype.face_filename = function() {
    	var fm = this,
    			name = fm.face.description.title;

    	//We need to replace all symbols and spaces with _, and add .zip
    	return name.replace(/[\s]/g, "_") + ".face";
    };

    FM.prototype.parse = function(input_str) {
    	var fm = this;

			return fm.calculate_conditionals(fm.calculate_math(fm.replace_tags(input_str)));
    };

    FM.prototype.parseInt = function(input_str) {
    	return parseInt(this.parse(input_str));
    }

    FM.prototype._math_regex = /\(?([\d]+)([\+\-\*\/])([\d]+)\)?/g;
    FM.prototype.calculate_math = function(input_str) {
    	/* This needs to handle math in strings, at the moment it will
    	 * look for [\d]+[\+\-\*\/][\d]+ (so any numbers, followed by
    	 * a mathematical operator, followed by another number) and replace
    	 * it with the calculated value
    	 */

    	 return input_str.replace(this._math_regex, 
    	 	function(match, val1, op, val2) {
    	 		val1 = parseInt(val1);
    	 		val2 = parseInt(val2);

    	 		switch(op) {
    	 			case '+':
    	 				return val1 + val2;
  	 				case '-':
  	 					return val1 - val2;
  	 				case '*':
  	 					return val1 * val2;
	 					case '/':
	 						return val1 / val2;
    	 		};
    	 	});
    };

    FM.prototype.conditional_regex = /\$([\d]+)([><]\=?)([\d]+)\?([\d\w]+):([\d\w]+)\$/g;
    FM.prototype.calculate_conditionals = function(input_str) {
    	return input_str.replace(this.conditional_regex,
    		function(match, left, op, right, trueval, falseval) {
    			left = parseInt(left);
    			right = parseInt(right);

    			switch(op) {
    				case '>':
    					return left > right ? trueval : falseval;
    				case '<':
    					return left < right ? trueval : falseval;
    				case '>=':
    					return left >= right ? trueval : falseval;
    				case '<=':
    					return left <= right ? trueval : falseval;
    			}
    		});
    };

    FM.prototype.replace_tags = function(input_str) {
    	return input_str.replace(/#(\w+)#/g, this.tags_replacer);
    };

  return FM;
})();
