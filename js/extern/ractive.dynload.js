(function() {
  var script_tags = document.getElementsByTagName("script");

  for(var i = 0; i < script_tags.length; i++) {
    var script_tag = script_tags[i];

    if(script_tag.type == 'text/ractive') {
      console.log(script_tag.type, script_tag.src);

      var req = {
        url: script_tag.src,
        async: false,
        dataType: 'html',
        success: function(data, status) {
          console.log(data, status);
          if(status === 'success') {
            script_tag.innerHTML = data;
          }
        }
      };
      
      $.ajax(req);
    }
  }
})();

