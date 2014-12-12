(function(FM) {

  FM.prototype._create_zip = function() {
    //We need to create a ZIP file
    // images/<hash>
    // fonts/<filename>
    // watchface.json
    // preview.png
    // description.json
    var fm = this,
    zip = new JSZip(),
    images_folder = zip.folder("images"),
    fonts_folder = zip.folder("fonts");

    //Export all the fonts
    for(var font_filename in fm.face.fonts) {
      if(fm.face.fonts.hasOwnProperty(font_filename)) {
        var font = fm.face.fonts[font_filename];
        if(fm._is_font_used(font.filename)) {
          fonts_folder.file(font.filename, font.file.asArrayBuffer());
        }
      }
    }

    //Export all the images
    for(var image_hash in fm.face.images) {
      if(fm.face.images.hasOwnProperty(image_hash)) {
        if(fm._is_image_used(image_hash)) {
          images_folder.file(image_hash, fm.face.images[image_hash].file.asArrayBuffer());
        }
      }
    }

    //Export the data
    zip.file("watchface.json", JSON.stringify(fm.face.watchface));
    zip.file("description.json", JSON.stringify(fm.face.description));
    zip.file("preview.png", fm.renderer._create_preview_image(), {base64: true});

    return zip;
  };

  FM.prototype.download_zip_file = function() {
    var fm = this,
    zip = fm._create_zip(),
    zip_blob = zip.generate({type:"blob"});

    saveAs(zip_blob, fm.face_filename());
  };

  FM.prototype.face_filename = function() {
    var fm = this,
    name = fm.face.description.title;

      //We need to replace all symbols and spaces with _, and add .zip
      return name.replace(/[\s]/g, "_") + ".face";
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

      var file = zip_file.file(filename);

      if(filename === 'watchface.json') {
        face.watchface = JSON.parse(file.asText());
      } else if (filename === 'description.json') {
        face.description = JSON.parse(file.asText());
      } else if (filename === 'preview.png') {
        var image = {
          file: file,
          img: new Image()
        };

        image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());
        face.preview_image = image;
      } else if (filename.indexOf('images/') === 0) {
        if(filename !== 'images/') {
          var image_hash = filename.substring(7),
          image = {
            file: file,
            img: new Image()
          };

          image.img.src = 'data:image/jpeg;base64,' + btoa(image.file.asBinary());
          image.img.className = 'preview_image';

          face.images[image_hash] = image;
        }
      } else if (filename.indexOf('fonts/') === 0) {
        if(filename !== 'fonts/') {
          var font_name = filename.substring(6),
              family_name = font_name.replace(/\W/g, '_'),
              font = {
                name: family_name,
                filename: font_name,
                file: file,
                data: btoa(file.asBinary())
              };

          face.fonts[family_name] = font;
        }
      } else {
        console.log('File ' + filename + ' is unknown');
      }
    }

    this.face = face;
  };

  FM.prototype.load_face_ajax = function(href) {
    var fm = this;

    JSZipUtils.getBinaryContent(href, function(err, data) {
      if(err) throw err;

      fm.load_face(data);
    });
  };

  FM.prototype.load_face = function(file) {
    var zip = new JSZip(file);

    fm._handle_zip(zip);

    fm.renderer.start_rendering();
    fm.reload_editor();
  }

  FM.prototype._is_font_used = function(font) {
    var fm = this;

    for(var i = 0; i < fm.face.watchface.length; i++) {
      if(fm.face.watchface[i].type === 'text' && fm.face.watchface[i].font_hash === font) {
        return true;
      }
    }

    return false;
  };

  FM.prototype._is_image_used = function(image) {
    var fm = this;

    for(var i = 0; i < fm.face.watchface.length; i++) {
      if(fm.face.watchface[i].type === 'image' && fm.face.watchface[i].hash === image) {
        return true;
      }
    }

    return false;
  }
})(FaceMaker);
