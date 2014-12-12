(function(FM) {

  Ractive.components.color = Ractive.extend({
    template: "<input type='color' value='{{hex}}'>",
    computed: {
      hex: {
        get: function() {
          return FM.argb_to_hex(this.get('argb'));
        },
        set: function(hex) {
          this.set('argb', FM.hex_to_argb(hex));
        }
      }
    }
  });

  Ractive.components.font = Ractive.extend({
    template: "<style>\n" +
      "@font-face {\n" +
      "  font-family: {{name}};\n" +
      "  src: url(data:font/ttf;base64,{{data}}) format('truetype');\n" +
      "};\n" +
      "</style>"
  });

  Ractive.components.image = Ractive.extend({
    template: "<style>\n" +
      ".image-{{name}} {\n" +
      "  width: {{width}}px;\n" +
      "  height: {{height}}px;\n" +
      "  background: url({{src}});\n" +
      "};\n" +
      "</style>"
  });

  FM.prototype.init_editor = function() {
    var fm = this;

    console.log("Initializing Editor");

    fm.editor = {};


    fm.editor.ractive = new Ractive({
      el: fm.options.editor,
      template: '#editor-template',
      data: fm,
      debug: true
    });

    r = fm.editor.ractive;

    r.on('call', function(event, method) {
      console.log(event, event.context, method);
      event.context[method]();
    });

    r.on('removeLayer', function(event, method) {
      console.log(this, event, method);

      fm.face.watchface.splice(event.index.index, 1);
      fm.face.watchface.splice(event.index.index, 1);
    });

    r.on('moveLayerUp', function(event, method) {
      var path = event.keypath.substring(0, event.keypath.lastIndexOf(".") + 1),
          index = event.index.index;

      var lower = r.get(path + (index - 1)),
          upper = r.get(path + (index));

      r.set(path + (index), lower);
      r.set(path + (index - 1), upper);

      fm.normalize_ids();
    });

    r.on('moveLayerDown', function(event, method) {
      var path = event.keypath.substring(0, event.keypath.lastIndexOf(".") + 1),
          index = event.index.index;

      var lower = r.get(path + (index)),
          upper = r.get(path + (index + 1));

      r.set(path + (index), upper);
      r.set(path + (index + 1), lower);

      fm.normalize_ids();
    });

    function intObserv(n, o, k) {
      this.set(k, parseInt(n));
    }

    r.observe(
      'face.watchface.*.alignment face.watchface.*.transform face.watchface.*.shape_type ' +
      'face.watchface.*.shape_opt',
      intObserv.bind(r)
    );

    return true;
  };

  FM.prototype.reload_editor = function() {
    this.editor.ractive.reset(this);
  };

  FM.prototype.remove_layer = function() {
    console.log(this);
  };

  FM.prototype.add_font_file = function(font_file) {
    var fm = this,
        r = fm.editor.ractive,
        hash = null,
        font = {};

    font.name = family_name;
    font.filename = font_name;
    font.file = file;
    font.data = data;

    r.set("face.fonts." + font.name, font);
  };

  FM.prototype.add_image_file = function(image_file) {
    var fm = this,
        r = fm.editor.ractive,
        hash = null,
        image = {
          file: image_file,
        };

    r.set("face.images." + hash, image);
  };

  FM.BLANK_SHAPE = {
    "color": "-1",
    "id": 0,
    "low_power": true,
    "opacity": "100",
    "r": "0",
    "radius": "50",
    "shape_opt": 0,
    "shape_type": 1,
    "sides": "6",
    "stroke_size": "5",
    "type": "shape",
    "height": "50",
    "width": "50",
    "x": "0",
    "y": "0"
  };

  FM.BLANK_IMAGE = {
    "alignment": 4,
    "hash": "",
    "height": "0",
    "id": 0,
    "low_power": true,
    "opacity": "100",
    "r": "0",
    "type": "image",
    "width": "0",
    "x": "0",
    "y": "0"
  };

  FM.BLANK_TEXT = {
    "alignment": 1,
    "bgcolor": "0",
    "color": "-1",
    "low_power_color": "-1",
    "bold": false,
    "font_family": 0,
    "id": 0,
    "italic": false,
    "low_power": true,
    "opacity": "100",
    "r": "0",
    "size": "24",
    "text": "New Text",
    "transform": 0,
    "type": "text",
    "x": "0",
    "y": "0"
  };

  FM.prototype.add_shape = function() {
    var fm = this,
      new_shape = $.extend({}, FM.BLANK_SHAPE);

    fm.editor.ractive.push("face.watchface", new_shape);
    fm.normalize_ids()
  };

  FM.prototype.add_text = function() {
    var fm = this,
    new_text = $.extend({}, FM.BLANK_TEXT);

    fm.editor.ractive.push("face.watchface", new_text);
    fm.normalize_ids()
  };

  FM.prototype.add_image = function() {
    console.log("add_image");

    var fm = this,
      new_image = $.extend({}, FM.BLANK_IMAGE);

    fm.editor.ractive.push("face.watchface", new_image);
    fm.normalize_ids()
  };

  FM.prototype.normalize_ids = function() {
    var fm = this,
      r = fm.editor.ractive,
      faces = r.get('face.watchface'),
      i = faces.length;

    while (i--) {
      r.set('face.watchface.' + i + '.id', i);
    }
  };

})(FaceMaker)
