(function (FM) {

  FM.prototype.init_editor = function() {
    var fm = this;

    console.log("Initializing Editor");
    if(fm.editor !== undefined) {
    
      fm.editor.ractive.reset(fm);
    
    } else {

      fm.editor = {};
      
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

      function intColorObserv(n, o, k) {
        this.set(k, n);
      }

      r.observe(
        'face.watchface.*.alignment face.watchface.*.transform', 
        intObserv.bind(r)
      );

      r.observe(
        'face.watchface.*.color face.watchface.*.bgcolor face.watchface.*.low_power_color', 
        intColorObserv.bind(r)
      );
    }
    return true;
  };

})(FaceMaker)