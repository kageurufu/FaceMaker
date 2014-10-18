(function(FM) {

  var R = function(fm) { 
    var r = this;

    r.options = fm.options;
    r.fm = fm;

    r.preview = $(r.options.preview)[0];
    r.rendering = false;

    r.init_canvas();
  };

  R.prototype.init_canvas = function() {
    var r = this,
        fm = r.fm;

    r.canvas = document.createElement('canvas');
    r.canvas.width = 320;
    r.canvas.height = 320;

    r.preview.appendChild(r.canvas);

    r.ctx = r.canvas.getContext("2d");

    r.canvas_width = 320;
    r.canvas_height = 320;

    r.ctx.fillStyle = 'rgb(255,255,255)';
    r.ctx.fillRect(0, 0, 320, 320);

    r.tint_canvas = document.createElement("canvas");
    r.tint_canvas.width = 320;
    r.tint_canvas.height = 320;
    r.tint_context = r.tint_canvas.getContext("2d");
  };

  R.prototype.start_rendering = function() {
    var r = this;

    r.rendering = true;
    requestAnimationFrame(r.render.bind(r));
  };

  R.prototype.stop_rendering = function() {
    this.rendering = false;
  };

  R.prototype.render = function() {
    var r = this,
        fm = r.fm,
        c = r.ctx;

    if (!r.rendering) {
      return;
    }

    requestAnimationFrame(r.render.bind(r));

    c.imageSmoothingEnabled = true;

    c.fillStyle = "rgb(255,255,255)";
    c.fillRect(0, 0, r.canvas_width, r.canvas_height);

    //For the moment, we use a 320px radius circle for clipping, per Moto 360
    c.save();


    c.beginPath();
    
    switch(fm.face_style) {
      default:
        fm.face_style = 'moto360';
      case 'g_watch_r':
      case 'moto360':
        c.arc(r.canvas_width / 2, r.canvas_height / 2, 160, 0, 2 * Math.PI);
        break;
      case 'gear_live':
        c.rect(0, 0, 320, 320);
        break;
      case 'g_watch':
        c.rect(0, 0, 280, 280);
        break;
    }

    c.closePath();
    c.clip();

    //Blank the watch face
    c.fillStyle = "rgb(0,0,0)";
    c.lineWidth = 0;
    c.fillRect(0, 0, r.canvas_width, r.canvas_height);

    for (var i in fm.face.watchface) {
      if (fm.face.watchface.hasOwnProperty(i)) {
        r.draw_layer(fm.face.watchface[i]);
      }
    }

    //Apply the clip, then mask off the rest of it for the moto
    c.restore();

    switch(fm.face_style) {
      case 'moto360':
        c.fillStyle = "rgb(255,255,255)"
        c.fillRect(0, 290, 320, 320);
        break;
    }

  };

  R.prototype.draw_layer = function(layer) {
    var r = this,
        fm = r.fm;

    if(fm.test_low_power_mode && !layer.low_power) {
      return;
    }

    switch (layer.type) {
      case 'text':
        r._draw_text(layer);
        break;
      case 'shape':
        r._draw_shape(layer);
        break;
      case 'image':
        r._draw_image(layer);
        break;
      default:
        break;
        console.log(layer.type + " is not a valid layer type");
    }
  };

  R.prototype._draw_image = function(layer) {
    var r = this,
        fm = r.fm,
        c = r.ctx,
        image_hash = layer.hash,
        image = fm.face.images[image_hash].img,

        x = fm.parseInt(layer.x),
        y = fm.parseInt(layer.y),
        ox = 0,
        oy = 0,
        width = fm.parseInt(layer.width),
        height = fm.parseInt(layer.height),
        rotation = fm.parseInt(layer.r);

    switch (layer.alignment) {
      case FM.ImageAlignment.top_left:
        ox -= width;
        oy -= height;
        break;
      case FM.ImageAlignment.top_center:
        ox -= width / 2;
        oy -= height;
        break;
      case FM.ImageAlignment.top_right:
        oy -= height;
        break;
      case FM.ImageAlignment.center_left:
        ox -= width;
        oy -= height / 2;
        break;
      case FM.ImageAlignment.center:
        ox -= width / 2;
        oy -= height / 2;
        break;
      case FM.ImageAlignment.center_right:
        oy -= height / 2;
        break;
      case FM.ImageAlignment.bottom_left:
        ox -= width;
        break;
      case FM.ImageAlignment.bottom_center:
        ox -= width / 2;
        break;
      case FM.ImageAlignment.bottom_right:
        //This is the default rendering position
        break;
    };
    
    //For rotation, theres a fair amount that needs to be done
    //The easiest way, will be to save the canvas, translate,
    //  rotate, draw, and restore
    c.save()
    c.translate(x, y);
    c.rotate(rotation * Math.PI / 180);

    c.drawImage(image, ox, oy, width, height);

    c.restore();
  }

  R.prototype._tint_image = function(image, tint_color) {
    //Takes an image, returns an image

  };

  R.prototype._draw_shape = function(layer) {
    var r = this,
        fm = r.fm,
        c = r.ctx,
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
      case FM.ShapeTypes.circle:
        c.beginPath();
        c.arc(x, y, radius, 0, 2 * Math.PI);

        if (layer.shape_opt === 0) {
          c.fill();
        } else {
          c.stroke();
        }

        c.closePath();

        break;
      case FM.ShapeTypes.square:
      case FM.ShapeTypes.line:
        //As far as I can tell, a line is just a rect, and a square is really a rect
        if (layer.shape_opt === 0) {
          c.fillRect(x, y, parseInt(layer.width), parseInt(layer.height));
        } else {
          c.strokeRect(x, y, parseInt(layer.width), parseInt(layer.height));
        }
        break;

      case FM.ShapeTypes.triangle:
        //Fun little hack to skip duplication of code
        layer.sides = "3";

      case FM.ShapeTypes.polygon:
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


  R.prototype._draw_text = function(layer) {
    var r = this,
        fm = r.fm,
        c = r.ctx,
        rotation = fm.parseInt(layer.r),
        x = fm.parseInt(layer.x),
        y = fm.parseInt(layer.y),
        text = fm.parse(layer.text);

    if (layer.transform == FM.Transform.uppercase) {
      text = text.toUpperCase();
    } else if (layer.transform == FM.Transform.lowercase) {
      text = text.toLowerCase();
    }

    c.textAlign = fm._parseAlignment(layer.alignment);

    c.save();
    c.translate(x, y);
    c.rotate(rotation * (Math.PI / 180));

    if(fm.test_low_power_mode) {
      c.fillStyle = fm._parseColor(layer.low_power_color, layer.opacity);
    } else {
      c.fillStyle = fm._parseColor(layer.color, layer.opacity);
    }

    if (layer.font_hash) {
      c.font = layer.size + "px " + layer.font_hash.replace(/\W/g, '_');
    } else {
      c.font = layer.size + "px Arial";
    }

    if (layer.bold) {
      c.font = "bold " + c.font;
    }
    if (layer.italic) {
      c.font = "italic " + c.font;
    }
    c.fillText(text, 0, 0);

    c.restore();
  };

  FM.Renderer = R;
})(FaceMaker);
