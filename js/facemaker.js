'use strict';

var FaceMaker = (function() {

  var FM = function(options) {
    if (!!options) {
      this.options = $.extend({}, this.defaults, this.options);
    } else {
      this.options = $.extend({}, this.defaults);
    }

    console.log("FaceMaker loading");

    this.new_face_button = $(this.options.new_face);
    this.download_face_button = $(this.options.download_face);

    this.face = null;

    for (var i in this) {
      if (i.indexOf("init_") == 0 && typeof(this[i]) == 'function') {
        this[i].bind(this)();
      }
    }

    this.renderer = new FM.Renderer(this);
  };

  FM.prototype.defaults = {
    editor: '#editor',
    preview: '#preview',
    new_face: "#new_face",
    download_face: "#download_face",
    examples: []
  };

  FM.FACER_VERSIONS = {
    '0.90.1b': {
      build_int: 49,
      build: '0.90.1 beta 1'
    },
    '0.90.11': {
      build_int: undefined,
      build: '0.90.11'
    }
  };

  FM.CURRENT_FACER_VERSION = FM.FACER_VERSIONS['0.90.11'];

  FM.ShapeTypes = {
    circle: 0,
    square: 1,
    polygon: 2,
    line: 3,
    triangle: 4
  };

  FM.ImageAlignment = {
    top_left: 8,
    top_center: 7,
    top_right: 6,
    center_left: 5,
    center: 4,
    center_right: 3,
    bottom_left: 2,
    bottom_center: 1,
    bottom_right: 0
  };

  FM.Alignment = {
    left: 0,
    center: 1,
    right: 2
  };

  FM.Transform = {
    uppercase: 1,
    lowercase: 2
  };

  FM.prototype.init_test_options = function() {
    var fm = this;

    fm.face_style = 'moto360';
    fm.use_test_date_time = false;
    fm.test_low_power_mode = false;
    fm.test_date_time = new Date();

    $("#low_power_mode").click(this.toggle_low_power_mode.bind(this));
    $("#fake_date_time").click(this.toggle_fake_date_time.bind(this));
    $("#fake_date, #fake_time").change(this.update_fake_date_time.bind(this));
    $("#face_style").change(this.change_face_style.bind(this));
  };

  FM.prototype.init_buttons = function() {
    this.new_face_button.click(this.new_face.bind(this));
    this.download_face_button.click(this.download_face.bind(this));
  };

  FM.prototype.change_face_style = function(e) {
    var fm = this;

    fm.face_style = e.target.value;
  };
  
  FM.prototype.toggle_low_power_mode = function(e) {
    var fm = this;

    fm.test_low_power_mode = e.target.checked;
  };

  FM.prototype.toggle_fake_date_time = function(e) {
    var fm = this;

    fm.use_test_date_time = e.target.checked;
  };

  FM.prototype.update_fake_date_time = function(e) {
    var fm = this,
        fake_date = $("#fake_date").val(),
        fake_time = $("#fake_time").val();

    fm.test_date_time = new Date(fake_date + " " + fake_time);
  };  

  FM.prototype.new_face = function() {
    this.rendering = false;

    var new_id;

    for (new_id = ''; new_id.length < 32;)
      new_id += Math.random().toString(36).substr(2, 1)

    this.face = {};
    this.face.description = {
        id: new_id,
        title: "Untitled Watchface",
        build: FM.CURRENT_FACER_VERSION.build,
        build_tag: FM.CURRENT_FACER_VERSION.build_tag
      };

    this.face.watchface = [];

    this.face.images = [];
    this.face.fonts = [];

    this.rendering = true;
    this.render();
    this.init_editor();
  };

  FM.prototype.download_face = function() {
    this.download_zip_file();
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
      case FM.Alignment.center:
        return 'center';
      case FM.Alignment.right:
        return 'right';
      case FM.Alignment.left:
      default:
        return 'left';
    }
  };


  FM.prototype._create_preview_image = function() {
    //Copy the canvas from 40,40 to 360, 340 to a PNG image
    var fm = this;

    return fm.preview.toDataURL().split(",")[1];
  };

  return FM;
})();
