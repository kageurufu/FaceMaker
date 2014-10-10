(function (FM) {
  
  function pad(str, len) {
    while (str.length < length) str = '0' + str;
    return str;
  };

  FM.prototype.hex_to_argb = function(hex) {
    if(hex === undefined) { return 0; };

    hex = hex.replace("#", "");
    if(hex.length == 6) {
      hex = "FF" + hex;
    };

    var a = "0x" + hex.substring(0, 2),
        r = "0x" + hex.substring(2, 4),
        g = "0x" + hex.substring(4, 6),
        b = "0x" + hex.substring(6, 8);

    return (parseInt(a) << 24) | (parseInt(r) << 16) | (parseInt(g) << 8) | parseInt(b);
  };

  FM.prototype.argb_to_hex = function(argb) {
    var a = argb >> 24 & 0xFF,
        r = argb >> 16 & 0xFF,
        g = argb >> 8  & 0xFF,
        b = argb       & 0xFF;

    return "#" + 
            pad(r.toString(16), 2) +
            pad(g.toString(16), 2) +
            pad(b.toString(16), 2);
  };

  FM.prototype.init_editor = function() {
    var fm = this;

    console.log("Initializing Editor");
    if(fm.editor !== undefined) {
    
      fm.editor.ractive.reset(fm);
    
    } else {

      fm.editor = {};
      
      Ractive.components.color = Ractive.extend({
        template: "<input type='color' value='{{hex}}'>",
        computed: {
          hex: {
            get: function() {
              var hex = fm.argb_to_hex(this.get('argb'));
              console.log(hex);
              return hex;
            },
            set: function(hex) {
              console.log(hex);
              this.set('argb', fm.hex_to_argb(hex));
            }
          }
        }
      });

      fm.editor.ractive = new Ractive({
        el: fm.options.editor,
        template: '#editor-template',
        data: fm,
        debug: true
      });

      r = fm.editor.ractive;

      function intObserv(n,o,k) {
        this.set(k, parseInt(n));
      }

      r.observe(
        'face.watchface.*.alignment face.watchface.*.transform face.watchface.*.shape_type ' +
        'face.watchface.*.shape_opt', 
        intObserv.bind(r)
      );

    }
    return true;
  };

})(FaceMaker)
