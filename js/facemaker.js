'use strict';

var FaceMaker = (function() {

  var CURRENT_FACER_VERSION = '0.90.11',
    ShapeTypes = {
      circle: 0,
      square: 1,
      polygon: 2,
      line: 3,
      triangle: 4
    },
    ImageAlignment = {
      top_left: 8,
      top_center: 7,
      top_right: 6,
      center_left: 5,
      center: 4,
      center_right: 3,
      bottom_left: 2,
      bottom_center: 1,
      bottom_right: 0
    },
    Alignment = {
      left: 0,
      center: 1,
      right: 2
    },
    Transform = {
      uppercase: 1,
      lowercase: 2
    };

  var FM = function(options) {
    if (!!options) {
      this.options = $.extend({}, this.defaults, this.options);
    } else {
      this.options = $.extend({}, this.defaults);
    }

    console.log("FaceMaker loading");

    this.new_face_button = $(this.options.new_face);
    this.download_face_button = $(this.options.download_face);

    this.preview = $(this.options.preview)[0];

    this.face = null;
    this.rendering = false;

    for (var i in this) {
      if (i.indexOf("init_") == 0 && typeof(this[i]) == 'function') {
        this[i].bind(this)();
      }
    }
  };

  FM.prototype.defaults = {
    editor: '#editor',
    preview: 'canvas#preview',
    new_face: "#new_face",
    download_face: "#download_face",
    examples: []
  };

  FM.prototype.init_buttons = function() {
    this.new_face_button.click(this.new_face.bind(this));
    this.download_face_button.click(this.download_face.bind(this));
  }

  FM.prototype.new_face = function() {
    this.rendering = false;

    var new_id;

    for (new_id = ''; new_id.length < 32;)
      new_id += Math.random().toString(36).substr(2, 1)

    this.face = {};
    this.face.description = {
      id: new_id,
      title: "Untitled Watchface",
      build: CURRENT_FACER_VERSION
    };
    this.face.watchface = [];

    this.face.images = [];
    this.face.fonts = [];

    this.rendering = true;
    this.render();
    this.init_editor();
  }

  FM.prototype.download_face = function() {
    this.download_zip_file();
  }


  FM.prototype.render = function() {
    var fm = this,
      c = fm.ctx;

    if (!fm.rendering) {
      return;
    }

    c.imageSmoothingEnabled = true;

    c.fillStyle = "rgb(255,255,255)";
    c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

    //For the moment, we use a 320px radius circle for clipping, per Moto 360
    c.save();
    c.beginPath();
    c.arc(fm.canvas_width / 2, fm.canvas_height / 2, 160, 0, 2 * Math.PI);
    c.closePath();
    c.clip();

    //Blank the watch face
    c.fillStyle = "rgb(0,0,0)";
    c.lineWidth = 0;
    c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

    for (var i in fm.face.watchface) {
      if (fm.face.watchface.hasOwnProperty(i)) {
        fm.draw_layer(fm.face.watchface[i]);
      }
    }

    //Apply the clip, the mask off the rest of it
    c.restore();

    c.fillStyle = "rgb(255,255,255)"
    c.fillRect(0, 290, 320, 320);

    requestAnimationFrame(fm.render.bind(this));
  };

  FM.prototype.draw_layer = function(layer) {
    var fm = this;

    switch (layer.type) {
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
        break;
        console.log(layer.type + " is not a valid layer type");
    }
  };

  FM.prototype._draw_image = function(layer) {
    var fm = this,
      c = fm.ctx,
      image_hash = layer.hash,
      image = fm.face.images[image_hash].img,

      x = fm.parseInt(layer.x),
      y = fm.parseInt(layer.y),
      ox = 0,
      oy = 0,
      w = fm.parseInt(layer.width),
      h = fm.parseInt(layer.height),
      r = fm.parseInt(layer.r);

    switch (layer.alignment) {
      case ImageAlignment.top_left:
        ox -= w;
        oy -= h;
        break;
      case ImageAlignment.top_center:
        ox -= w / 2;
        oy -= h;
        break;
      case ImageAlignment.top_right:
        oy -= h;
        break;
      case ImageAlignment.center_left:
        ox -= w;
        oy -= h / 2;
        break;
      case ImageAlignment.center:
        ox -= w / 2;
        oy -= h / 2;
        break;
      case ImageAlignment.center_right:
        oy -= h / 2;
        break;
      case ImageAlignment.bottom_left:
        ox -= w;
        break;
      case ImageAlignment.bottom_center:
        ox -= w / 2;
        break;
      case ImageAlignment.bottom_right:
        //This is the default rendering position
        break;
    };

    //For rotation, theres a fair amount that needs to be done
    //The easiest way, will be to save the canvas, translate,
    //  rotate, draw, and restore
    c.save()
    c.translate(x, y);
    c.rotate(r * Math.PI / 180);

    c.drawImage(image, ox, oy, w, h);

    c.restore();
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
    if (layer.shape_opt) {
      c.strokeStyle = fm._parseColor(layer.color, layer.opacity);
    } else {
      c.fillStyle = fm._parseColor(layer.color, layer.opacity);
    }

    c.lineWidth = parseInt(layer.stroke_size) / 2;

    switch (layer.shape_type) {
      case ShapeTypes.circle:
        c.beginPath();
        c.arc(x, y, radius, 0, 2 * Math.PI);

        if (layer.shape_opt === 0) {
          c.fill();
        } else {
          c.stroke();
        }

        c.closePath();

        break;
      case ShapeTypes.square:
      case ShapeTypes.line:
        //As far as I can tell, a line is just a rect, and a square is really a rect
        if (layer.shape_opt === 0) {
          c.fillRect(x, y, parseInt(layer.width), parseInt(layer.height));
        } else {
          c.strokeRect(x, y, parseInt(layer.width), parseInt(layer.height));
        }
        break;

      case ShapeTypes.triangle:
        //Fun little hack to skip duplication of code
        layer.sides = "3";

      case ShapeTypes.polygon:
        var num_sides = parseInt(layer.sides),
          angle = 2 * Math.PI / num_sides;

        var rotation = (90 + fm.parseInt(layer.r)) * Math.PI / 180;

        c.beginPath();

        c.moveTo(x + radius * Math.cos(angle + rotation), y + radius * Math.sin(angle + rotation));

        for (var i = 0; i <= num_sides; i++) {
          c.lineTo(x + radius * Math.cos(i * angle + rotation), y + radius * Math.sin(i * angle + rotation));
        }

        c.closePath();

        if (layer.shape_opt) {
          c.stroke();
        } else {
          c.fill();
        }
        break;
      default:
        break;
    }
  }


  FM.prototype._draw_text = function(layer) {
    var fm = this,
      c = fm.ctx,
      rotation = fm.parseInt(layer.r),
      x = fm.parseInt(layer.x),
      y = fm.parseInt(layer.y),
      text = fm.parse(layer.text);

    if (layer.transform == Transform.uppercase) {
      text = text.toUpperCase();
    } else if (layer.transform == Transform.lowercase) {
      text = text.toLowerCase();
    }

    c.textAlign = fm._parseAlignment(layer.alignment);

    c.save();
    c.translate(x, y);
    c.rotate(rotation * (Math.PI / 180));

    c.fillStyle = fm._parseColor(layer.color, layer.opacity);

    if (layer.font_hash) {
      c.font = layer.size + "px " + layer.font_hash.replace(/\W/g, '_');
    } else {
      c.font = layer.size + "px Arial";
    }

    c.fillText(text, 0, 0);

    c.restore();
  };

  FM.prototype._parseColor = function(color_str, opacity) {
    var color = parseInt(color_str),
      r = color >> 16 & 0xFF,
      g = color >> 8 & 0xFF,
      b = color & 0xFF,
      o = this.parseInt(opacity) / 100;

    return "rgba(" + r + "," + g + "," + b + "," + o + ")";
  };

  FM.prototype._parseAlignment = function(alignment) {
    switch (alignment) {
      case Alignment.center:
        return 'center';
      case Alignment.right:
        return 'right';
      case Alignment.left:
      default:
        return 'left';
    }
  };

  FM.prototype.init_preview = function() {
    var fm = this;

    fm.ctx = fm.preview.getContext("2d");

    fm.canvas_width = fm.preview.width;
    fm.canvas_height = fm.preview.height;

    fm.ctx.fillStyle = 'rgb(255,255,255)';
    fm.ctx.fillRect(0, 0, fm.preview.width, fm.preview.height);

    return true;
  };

  FM.prototype._create_preview_image = function() {
    //Copy the canvas from 40,40 to 360, 340 to a PNG image
    var fm = this;

    return fm.preview.toDataURL().split(",")[1];
  };

  return FM;
})();
