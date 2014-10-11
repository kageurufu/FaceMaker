(function(FM) {

  FM.pad = function(str, len) {
    return ("00000000" + ('' + str)).slice(-len);
  };

  FM.hex_to_argb = function(hex) {
    if (hex === undefined) {
      return 0;
    };

    hex = hex.replace("#", "");
    if (hex.length == 6) {
      hex = "FF" + hex;
    };

    var a = "0x" + hex.substring(0, 2),
      r = "0x" + hex.substring(2, 4),
      g = "0x" + hex.substring(4, 6),
      b = "0x" + hex.substring(6, 8);

    return (parseInt(a) << 24) | (parseInt(r) << 16) | (parseInt(g) << 8) | parseInt(b);
  };

  FM.argb_to_hex = function(argb) {
    var a = argb >> 24 & 0xFF,
      r = argb >> 16 & 0xFF,
      g = argb >> 8 & 0xFF,
      b = argb & 0xFF;

    return "#" +
      FM.pad(r.toString(16), 2) +
      FM.pad(g.toString(16), 2) +
      FM.pad(b.toString(16), 2);
  };

})(FaceMaker);
