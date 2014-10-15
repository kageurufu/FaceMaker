(function(FM) {

  FM.prototype.init_canvas = function() {
    var fm = this;

    fm.ctx = fm.preview.getContext("2d");

    fm.canvas_width = fm.preview.width;
    fm.canvas_height = fm.preview.height;

    fm.ctx.fillStyle = 'rgb(255,255,255)';
    fm.ctx.fillRect(0, 0, fm.preview.width, fm.preview.height);
  };

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
    
    switch(fm.face_style) {
      default:
        fm.face_style = 'moto360';
      case 'g_watch_r':
      case 'moto360':
        c.arc(fm.canvas_width / 2, fm.canvas_height / 2, 160, 0, 2 * Math.PI);
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
    c.fillRect(0, 0, fm.canvas_width, fm.canvas_height);

    for (var i in fm.face.watchface) {
      if (fm.face.watchface.hasOwnProperty(i)) {
        fm.draw_layer(fm.face.watchface[i]);
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
      case FM.ImageAlignment.top_left:
        ox -= w;
        oy -= h;
        break;
      case FM.ImageAlignment.top_center:
        ox -= w / 2;
        oy -= h;
        break;
      case FM.ImageAlignment.top_right:
        oy -= h;
        break;
      case FM.ImageAlignment.center_left:
        ox -= w;
        oy -= h / 2;
        break;
      case FM.ImageAlignment.center:
        ox -= w / 2;
        oy -= h / 2;
        break;
      case FM.ImageAlignment.center_right:
        oy -= h / 2;
        break;
      case FM.ImageAlignment.bottom_left:
        ox -= w;
        break;
      case FM.ImageAlignment.bottom_center:
        ox -= w / 2;
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


  FM.prototype._draw_text = function(layer) {
    var fm = this,
      c = fm.ctx,
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

    c.fillStyle = fm._parseColor(layer.color, layer.opacity);

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

})(FaceMaker);
