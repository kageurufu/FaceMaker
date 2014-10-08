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
		c.fillStyle = "rgb(5,55,55)";
		c.lineWidth = 0;
		c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

		for(var i in fm.face.watchface) {
			fm.draw_face(c, fm.face.watchface[i]);
		}

		c.fillStyle = "rgb(0, 0, 0)"
		c.fillRect(0, 330, fm.canvas_width, 100);
		//Apply the clip, the mask off the rest of it
		c.restore();

		requestAnimationFrame(fm.render.bind(this));
	};

	FM.prototype.draw_face = function(c, face) {
		var fm = this;

		switch(face.type) {
			case 'image':
				var image_hash = face.hash,
					image = fm.face.images[image_hash].img,
					x = parseInt(face.x) + 40,
					y = parseInt(face.y) + 40,
					w = parseInt(face.width),
					h = parseInt(face.height);

				c.drawImage(image, x, y, w, h);
				break;
			case 'shape':
				break;
			case 'text':
				var rotation = parseInt(face.r),
					x = parseInt(face.x) + 40,
					y = parseInt(face.y) + 40;

				c.save();
				c.translate(x, y);
				c.rotate(rotation * (Math.PI / 180));

				c.fillStyle = fm._parseColor(face.bgcolor);

				c.font = face.size + "px " + "Arial";
				c.fillText(fm.format(face.text), 0, 0);
				c.restore();

				break;
			default:
				throw face.type;
		}
	};

	FM.prototype._parseColor = function(color_str) {
		if(color_str === '0') {
			return '#FFF';
		}
		console.log(color_str);
		return color_str;
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
				var image_hash = filename.substring(7),
					image = {
						file: file,
						img: new Image()
					};

				image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());

				face.images[image_hash] = image;
			} else if (filename.indexOf('fonts/') === 0) {
				var font_name = filename.substring(6);
				face.fonts[font_name] = file;
			} else {
				throw 'File ' + filename + ' is unknown';
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