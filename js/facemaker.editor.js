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

  FM.prototype.add_shape = function() {
    var fm = this,
      new_shape = {
        alignment: NaN,
        color: "-1",
        height: "50",
        id: 1,
        low_power: true,
        opacity: "100",
        r: "0",
        radius: "50",
        shape_opt: 0,
        shape_type: 0,
        sides: "6",
        stroke_size: "5",
        transform: NaN,
        type: "shape",
        width: "50",
        x: "0",
        y: "0"
      };

    fm.editor.ractive.push("face.watchface", new_shape);
    fm.normalize_ids()
  };

  FM.prototype.add_text = function() {
    var fm = this,
      new_text = {
        alignment: 0,
        bgcolor: "0",
        bold: false,
        color: "-1",
        font_family: 0,
        font_hash: undefined,
        id: 0,
        italic: false,
        low_power: true,
        low_power_color: "0",
        opacity: "100",
        r: "0",
        size: "12",
        text: "Text",
        transform: 0,
        type: "text",
        x: "0",
        y: "0"
      };

    fm.editor.ractive.push("face.watchface", new_text);
    fm.normalize_ids()
  };

  FM.prototype.add_image = function() {
    console.log("add_image");

    var fm = this,
      new_image = {
        alignment: 4,
        hash: "",
        height: "0",
        id: 0,
        low_power: true,
        opacity: "100",
        r: "0",
        type: "image",
        width: "0",
        x: "0",
        y: "0"
      };

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
