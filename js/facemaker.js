'use strict';

var FaceMaker = (function() {

	var FM = function(options) {
		if(!!options) {
			this.options = $.extend({}, this.defaults, this.options);
		} else {
			this.options = $.extend({}, this.defaults);
		}

		console.log("FaceMaker loading");

		this.editor = $(this.options.editor);

		this.preview = $(this.options.preview)[0];

		if(!this.editor || !this.preview) {
			throw "Unable to initialize elements";
		}

		this.face = null;
		this.rendering = false;

		this.init_preview();
		this.init_editor();
	};

	FM.prototype.defaults = {
		editor: '#editor',
		preview: 'canvas#preview',
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

		c.fillStyle = "rgb(255,255,255)"
		c.fillRect(0, 330, fm.canvas_width, 100);
		//Apply the clip, the mask off the rest of it
		c.restore();
    
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
		var image_hash = layer.hash,
				image = fm.face.images[image_hash].img,

				x = parseInt(layer.x) + 40,
				y = parseInt(layer.y) + 40,
				w = parseInt(layer.width),
	      h = parseInt(layer.height);
  	fm.ctx.drawImage(image, x, y, w, h);
  }

  FM.prototype._draw_shape = function(layer) {
    var fm = this,
        c = fm.ctx,
        x = parseInt(layer.x) + 40,
        y = parseInt(layer.y) + 40,
        radius = parseInt(layer.radius);
    /*
     * Some Notes, per Reverse Engineering
     * shape_opt 0 - Fill, 1 - Stroke
     */
  
    if(layer.shape_opt) {
      c.strokeStyle = fm._parseColor(layer.color);
    } else {
      c.fillStyle = fm._parseColor(layer.color);
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
        rotation = parseInt(layer.r),
		  	x = parseInt(layer.x) + 40,
				y = parseInt(layer.y) + 40,
        text = fm.format(layer.text);
  
    if(layer.transform == fm.Transform.uppercase) {
      text = text.toUpperCase();
    } else if (layer.transform == fm.Transform.lowercase) {
      text = text.toLowerCase();
    }

		c.save();
		c.translate(x, y);
		c.rotate(rotation * (Math.PI / 180));

    c.fillStyle = fm._parseColor(layer.color);
    
    switch(layer.alignment) {
      case fm.Alignment.center:
        c.textAlign = 'center';
        break;
      case fm.Alignment.right:
        c.textAlign = 'right';
        break;
      case fm.Alignment.left:
      default:
        c.textAlign = 'left';
    }
    
		c.font = layer.size + "px " + "Arial";
		c.fillText(text, 0, 0);

    c.restore();
  };

	FM.prototype._parseColor = function(color_str) {
    var color = parseInt(color_str),
        r = color >> 16 & 0xFF,
        g = color >>  8 & 0xFF,
        b = color       & 0xFF;

		return "rgb(" + r + "," + g + "," + b + ")";
	};

	FM.prototype._parseAlignment = function(alignment) {

	};

	FM.prototype.ReplaceVariables = function(variable) {

	};

	FM.prototype.init_editor = function() {
		var fm = this;
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

			var zip = new JSZip(data);

			fm._handle_zip(zip);

			fm.rendering = true;
			requestAnimationFrame(fm.render.bind(fm));
		});
	};

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
				face.preview_image === file.asBinary();
			} else if (filename.indexOf('images/') === 0) {
        if(filename !== 'images/') {
  				var image_hash = filename.substring(7),
	  			  	image = {
		  	  			file: file,
		    				img: new Image()
	  		  		};
  
  				image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());

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

	FM.prototype.format = function(input_str) {
		return input_str.replace(/#(\w+)#/g, this.format_replacer);
	};

	var m_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var m_names_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	FM.prototype.format_replacer = function(full_match, match) {
		switch(match) {
			case "Dy": // Year
			case "Dyyyy": // Year
				return (new Date()).getFullYear();
			case "Dyy": // Year
				return (new Date()).getFullYear() % 100;
			case "DM": // Month in Year
			case "DMM": // Month in Year
				return (new Date()).getMonth() + 1;
			case "DMMM": // Month in Year
				return m_names_short[(new Date()).getMonth()];
			case "DMMMM": // Month in Year
				return m_names[(new Date()).getMonth()];
			case "DW": // Week in Month
				return (0 | (new Date()).getDate() / 7) + 1;
			case "Dw": // Week in Year
				return "41";
			case "DD": // Day in Year 
				return "280";
			case "Dd": // Day in Month 
				return "7";
			case "DE": // Day of Week 
				return "Tue";
			case "DEEEE": // Day of Week 
				return "Tuesday";
			case "DF": // Day of Week in Month
				return "1";
			case "Da": // AM/PM
				return "PM";
			case "Dh": // Hour in Day (1-12)
				return "2";
			case "Dk": // Hour in Day (1-24)
				return "14";
			case "DH": // Hour in Day (0-23)
				return "14";
			case "DK": // Hour in Day (0-11)
				return "2";
			case "DHZ": // Hour in Day (leading zero) (00-23)
				return "14";
			case "DkZ": // Hour in Day (leading zero) (01-24)
				return "14";
			case "DKZ": // Hour in Day (12 hour, leading zero) (00-11)
				return "02";
			case "DhZ": // Hour in Day (12 hour, leading zero) (01-12)
				return "02";
			case "DhoT": // Value for Hour Rotation (12 hour)
				return "60";
			case "DhoTb": // Value for Hour Rotation (24 hour)
				return "210";
			case "DWFK": // Value for Hour Rotation (12 hour, wearface)
				return "60";
			case "DWFH": // Value for Hour Rotation (24 hour, wearface)
				return "210";
			case "DhT": // String value for hour (12 hour)
				return "TWO";
			case "DkT": // String value for hour (24 hour)
				return "FOURTEEN";
			case "Dm": // Minute in Hour
				return "43";
			case "DmZ": // Minute in Hour (leading zero)
				return "43";
			case "DmoT": // Value for minute hand rotation
				return "258";
			case "DWFM": // Value for minute hand rotation (wearface image)
				return "258";
			case "DmT": // String value for minutes
				return "FORTY THREE";
			case "DmMT": // String value for minutes (tens place)
				return "FORTY";
			case "DmST": // String value for minutes (ones place)
				return "THREE";
			case "Ds": // Second in minute
				return "56";
			case "DsZ": // Second in minute (leading zero)
				return "56";
			case "DseT": // Value for second hand rotation
				return "186";
			case "DWFS": // Rotation value for second hand (wearface image)
				return "186";
			case "Dz": // Timezone
				return "MST";
			case "Dzzzz": // Timezone
				return "Mountain Standard Time";
			case "BLP": // Battery Level Percentage
				return "95%";
			case "BLN": // Battery Leven Integer
				return "95";
			case "BTC": // Battery Temperature (°C)
				return "31°C";
			case "BTI": // Battery Temperature (°F)
				return "88°F";
			case "BTCN": // Battery Temperature (Celcius)
				return "31";
			case "BTIN": // Battery Temperature (Fahrenheit)
				return "88";
			case "BS": // Battery Charging Status
				return "Charging";
			case "ZLP": // Low Power Mode
				return "false";
			case "ZSC": // Step Count (may not be accurate)
				return "0";
			case "WLC": // Weather Location
				return "Sam Hughes";
			case "WTH": // Today's High
				return "88";
			case "WTL": // Todays' Low
				return "67";
			case "WCT": // Current Temp
				return "88";
			case "WCCI": // Current Condition Icon
				return "01";
			case "WCCT": // Current Condition Text
				return "Fair";
			case "WCHN": // Current Humidity Number
				return "22.0";
			case "WCHP": // Current Humidity Percentage
				return "22.0%";
			case "WFAH": // Forecast Day 1 High
				return "88";
			case "WFAL": // Forecast Day 1 Low
				return "67";
			case "WFACT": // Forecast Day 1 Condition Text
				return "Mostly cloudy";
			case "WFACI": // Forecast Day 1 Condition Icon
				return "03";
			case "WFBH": // Forecast Day 2 High
				return "83";
			case "WFBL": // Forecast Day 2 Low
				return "64";
			case "WFBCT": // Forecast Day 1 Condition Text
				return "Thunderstorms";
			case "WFBCI": // Forecast Day 1 Condition Icon
				return "11";
			case "WFCH": // Forecast Day 1 High
				return "81";
			case "WFCL": // Forecast Day 1 Low
				return "62";
			case "WFCCT": // Forecast Day 1 Condition Text
				return "AM Thunderstorms";
			case "WFCCI": // Forecast Day 1 Condition Icon
				return "11";
			case "WFDH": // Forecast Day 1 High
				return "85";
			case "WFDL": // Forecast Day 1 Low
				return "60";
			case "WFDCT": // Forecast Day 1 Condition Text
				return "Sunny";
			case "WFDCI": // Forecast Day 1 Condition Icon
				return "01";
			case "WFEH": // Forecast Day 1 High
				return "88";
			case "WFEL": // Forecast Day 1 Low
				return "61";
			case "WFECT": // Forecast Day 1 Condition Text
				return "Sunny";
			case "WFECI": // Forecast Day 1 Condition Icon
				return "01";
			case "WFFH": // Forecast Day 1 High
				return "88";
			case "WFFL": // Forecast Day 1 Low
				return "61";
			case "WFFCT": // Forecast Day 1 Condition Text
				return "Sunny";
			case "WFFCI": // Forecast Day 1 Condition Icon
				return "01";
			case "WFGH": // Forecast Day 1 High
				return "88";
			case "WFGL": // Forecast Day 1 Low
				return "61";
			case "WFGCT": // Forecast Day 1 Condition Text
				return "Sunny";
			case "WFGCI": // Forecast Day 1 Condition Icon
				return "01";
			default:
				return "#" + match + "#";
		}

		return "0";
	};

	return FM;
})(formatter);
