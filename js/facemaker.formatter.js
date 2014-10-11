(function(FM) {
  // Convert numbers to words
  // copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
  // permission to use this Javascript on your web page is granted
  // provided that all of the code (including this copyright notice) is
  // used exactly as shown (you can change the numbering system if you wish)
  var th = ['', 'thousand', 'million', 'billion', 'trillion'];
  var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function toWords(s) {
      s = s.toString();
      s = s.replace(/[\, ]/g, '');
      if (s != parseFloat(s)) return 'not a number';
      var x = s.indexOf('.');
      if (x == -1) x = s.length;
      if (x > 15) return 'too big';
      var n = s.split('');
      var str = '';
      var sk = 0;
      for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
          if (n[i] == '1') {
            str += tn[Number(n[i + 1])] + ' ';
            i++;
            sk = 1;
          } else if (n[i] != 0) {
            str += tw[n[i] - 2] + ' ';
            sk = 1;
          }
        } else if (n[i] != 0) {
          str += dg[n[i]] + ' ';
          if ((x - i) % 3 == 0) str += 'hundred ';
          sk = 1;
        }
        if ((x - i) % 3 == 1) {
          if (sk) str += th[(x - i - 1) / 3] + ' ';
          sk = 0;
        }
      }
      if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
      }
      return str.replace(/\s+/g, ' ');
    }
    //End copyright

  var m_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    m_names_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    conditional_regex = /\$([\d]+)([><]\=?)([\d]+)\?([\d\w]+):([\d\w]+)\$/g,
    math_regex = /\(?([\d]+)([\+\-\*\/])([\d]+)\)?/g;

  FM.prototype.parse = function(input_str) {
    var fm = this,
      val = input_str;

    //TODO: Do this WAAAAYYYY better. repeating works for now, but its ugly and stupid and hacky
    val = fm.replace_tags(val);
    val = fm.calculate_math(val);
    val = fm.calculate_conditionals(val);
    val = fm.calculate_math(val);
    val = fm.calculate_conditionals(val);
    val = fm.calculate_math(val);
    val = fm.calculate_conditionals(val);
    val = fm.calculate_math(val);
    val = fm.calculate_conditionals(val);
    val = fm.calculate_math(val);
    val = fm.calculate_conditionals(val);

    return val;
  };

  FM.prototype.parseInt = function(input_str) {
    return parseInt(this.parse(input_str));
  }

  FM.prototype.calculate_math = function(input_str) {
    /* This needs to handle math in strings, at the moment it will
     * look for [\d]+[\+\-\*\/][\d]+ (so any numbers, followed by
     * a mathematical operator, followed by another number) and replace
     * it with the calculated value
     */

    return input_str.replace(math_regex,
      function(match, val1, op, val2) {
        val1 = parseInt(val1);
        val2 = parseInt(val2);

        switch (op) {
          case '+':
            return val1 + val2;
          case '-':
            return val1 - val2;
          case '*':
            return val1 * val2;
          case '/':
            return val1 / val2;
        };

      });

  };


  FM.prototype.calculate_conditionals = function(input_str) {
    return input_str.replace(this.conditional_regex,
      function(match, left, op, right, trueval, falseval) {
        left = parseInt(left);
        right = parseInt(right);

        switch (op) {
          case '>':
            return left > right ? trueval : falseval;
          case '<':
            return left < right ? trueval : falseval;
          case '>=':
            return left >= right ? trueval : falseval;
          case '<=':
            return left <= right ? trueval : falseval;
        }
      });

  };

  FM.prototype.replace_tags = function(input_str) {
    return input_str.replace(/#(\w+)#/g, this.tags_replacer);
  };

  FM.prototype.tags_replacer = function(full_match, match) {
    var d = new Date();

    if (FM.FormatTags.hasOwnProperty(match)) {
      try {
        return FM.FormatTags[match](d, fm._weather_data);
      } catch(e) {
        console.log(e);
        return 'ERROR';
      }
    }

    return "0";
  };

  FM.FormatTags = {};

  FM.AddFormatTag = function(tag, description, func) {
    this.FormatTags[tag] = func;
    func.tag = tag;
    func.description = description;
  }

  FM.AddFormatTag("Dy", "Year", function(d, w) {
    return d.format("Y");
  });

  FM.AddFormatTag("Dyy", "Short Year", function(d, w) {
    return d.format("y");
  });

  FM.AddFormatTag("Dyyy", "Year", function(d, w) {
    return d.format("Y");
  });

  FM.AddFormatTag("DM", "Month in Year (Numeric)", function(d, w) {
    return d.format("n");
  });

  FM.AddFormatTag("DMM", "Month in Year (Numeric)", function(d, w) {
    return d.format("m");
  });

  FM.AddFormatTag("DMMM", "Month in Year (Short String)", function(d, w) {
    return d.format("M");
  });

  FM.AddFormatTag("DMMMM", "Month in Year (String)", function(d, w) {
    return d.format("F");
  });

  FM.AddFormatTag("DW", "Week in Month", function(d, w) {
    return (0 | d.getDate() / 7) + 1;
  });

  FM.AddFormatTag("Dw", "Week in Year", function(d, w) {
    return d.format("W");
  });

  FM.AddFormatTag("DD", "Day in Year ", function(d, w) {
    return d.format("z");
  });

  FM.AddFormatTag("Dd", "Day in Month ", function(d, w) {
    return d.format("w");
  });

  FM.AddFormatTag("DE", "Day of Week ", function(d, w) {
    return d.format("D");
  });

  FM.AddFormatTag("DEEEE", "Day of Week ", function(d, w) {
    return d.format("I");
  });

  FM.AddFormatTag("DF", "Day of Week in Month", function(d, w) {
    return 3; //UNIMPLEMENTED
  });

  FM.AddFormatTag("Da", "AM/PM", function(d, w) {
    return d.format("A");
  });

  FM.AddFormatTag("Dh", "Hour in Day (1-12)", function(d, w) {
    return d.format("g");
  });

  FM.AddFormatTag("Dk", "Hour in Day (1-24)", function(d, w) {
    return d.format("h");
  });

  FM.AddFormatTag("DH", "Hour in Day (0-23)", function(d, w) {
    return d.format("H");
  });

  FM.AddFormatTag("DK", "Hour in Day (0-11)", function(d, w) {
    return d.format("h");
  });

  FM.AddFormatTag("DHZ", "Hour in Day (leading zero) (00-23)", function(d, w) {
    return d.format("G");
  });

  FM.AddFormatTag("DkZ", "Hour in Day (leading zero) (01-24)", function(d, w) {
    return d.format("G"); //TODO: Implement
  });

  FM.AddFormatTag("DKZ", "Hour in Day (12 hour, leading zero) (00-11)", function(d, w) {
    return d.format("h");
  });

  FM.AddFormatTag("DhZ", "Hour in Day (12 hour, leading zero) (01-12)", function(d, w) {
    return d.format("h");
  });

  FM.AddFormatTag("DhoT", "Value for Hour Rotation (12 hour)", function(d, w) {
    return d.getHours() * 30; // 360 / 12
  });

  FM.AddFormatTag("DhoTb", "Value for Hour Rotation (24 hour)", function(d, w) {
    return d.getHours() * 15; // 360 / 24
  });

  FM.AddFormatTag("DWFK", "Value for Hour Rotation (12 hour, wearface)", function(d, w) {
    return d.getHours() * 30; // 360 / 12
  });

  FM.AddFormatTag("DWFH", "Value for Hour Rotation (24 hour, wearface)", function(d, w) {
    return d.getHours() * 15; // 360 / 24
  });

  //String Values, how should I handle this?
  FM.AddFormatTag("DhT", "String value for hour (12 hour)", function(d, w) {
    return toWords((d.getHours() - 1) % 12);
  });

  FM.AddFormatTag("DkT", "String value for hour (24 hour)", function(d, w) {
    return toWords(d.getHours());
  });

  FM.AddFormatTag("Dm", "Minute in Hour", function(d, w) {
    return d.getMinutes();
  });

  FM.AddFormatTag("DmZ", "Minute in Hour (leading zero)", function(d, w) {
    return FM.pad("" + d.getMinutes(), 2);
  });

  FM.AddFormatTag("DmoT", "Value for minute hand rotation", function(d, w) {
    return d.getMinutes() * 5; // 360 / 60
  });

  FM.AddFormatTag("DWFM", "Value for minute hand rotation (wearface image)", function(d, w) {
    return d.getMinutes() * 5; // 360 / 60
  });

  FM.AddFormatTag("DmT", "String value for minutes", function(d, w) {
    return toWords(d.getMinutes());
  });

  FM.AddFormatTag("DmMT", "String value for minutes (tens place)", function(d, w) {
    return toWords(Math.floor(d.getMinutes() / 10) * 10); // floor(45 / 10) * 10 = 40
  });

  FM.AddFormatTag("DmST", "String value for minutes (ones place)", function(d, w) {
    return toWords(d.getMinutes() % 10);
  });

  FM.AddFormatTag("Ds", "Second in minute", function(d, w) {
    return d.getSeconds();
  });

  FM.AddFormatTag("DsZ", "Second in minute (leading zero)", function(d, w) {
    return FM.pad(d.getSeconds(), 2);
  });

  FM.AddFormatTag("DseT", "Value for second hand rotation", function(d, w) {
    return d.getSeconds() * 6;
  });

  FM.AddFormatTag("DWFS", "Rotation value for second hand (wearface image)", function(d, w) {
    return d.getSeconds() * 6;
  });

  FM.AddFormatTag("Dz", "Timezone", function(d, w) {
    return 'MST'; //Unimplemented
  });

  FM.AddFormatTag("Dzzzz", "Timezone", function(d, w) {
    return "Mountain Standard Time"; // Unimplemented
  });

  FM.AddFormatTag("BLP", "Battery Level Percentage", function(d, w) {
    return "95%"; // Unimplemented
  });

  FM.AddFormatTag("BLN", "Battery Level Integer", function(d, w) {
    return 95; // Unimplemented
  });

  FM.AddFormatTag("BTC", "Battery Temperature (°C)", function(d, w) {
    return "31°C"; // Unimplemented
  });

  FM.AddFormatTag("BTI", "Battery Temperature (°F)", function(d, w) {
    return "88°F"; // Unimplemented
  });

  FM.AddFormatTag("BTCN", "Battery Temperature (Celcius)", function(d, w) {
    return "31"; // Unimplemented
  });

  FM.AddFormatTag("BTIN", "Battery Temperature (Fahrenheit)", function(d, w) {
    return "88"; // Unimplemented
  });

  FM.AddFormatTag("BS", "Battery Charging Status", function(d, w) {
    return "Charging"; // Unimplemented
  });

  FM.AddFormatTag("ZLP", "Low Power Mode", function(d, w) {
    return "false"; // Unimplemented
  });

  FM.AddFormatTag("ZSC", "Step Count (may not be accurate)", function(d, w) {
    return "0"; // Unimplemented
  });

  FM.AddFormatTag("WLC", "Weather Location", function(d, w) {
    return w.city.name;
  });

  FM.AddFormatTag("WTH", "Today's High", function(d, w) {
    return w.list[0].temp.max;
  });

  FM.AddFormatTag("WTL", "Todays' Low", function(d, w) {
    return w.list[0].temp.min;
  });

  FM.AddFormatTag("WCT", "Current Temp", function(d, w) {
    return w.list[0].temp.day;
  });

  FM.AddFormatTag("WCCI", "Current Condition Icon", function(d, w) {
    return w.list[0].weather[0].icon;
  });

  FM.AddFormatTag("WCCT", "Current Condition Text", function(d, w) {
    return w.list[0].weather[0].main;
  });

  FM.AddFormatTag("WCHN", "Current Humidity Number", function(d, w) {
    return w.list[0].humidity;
  });

  FM.AddFormatTag("WCHP", "Current Humidity Percentage", function(d, w) {
    return w.list[0].humidity + "%";
  });

  FM.AddFormatTag("WFAH", "Forecast Day 1 High", function(d, w) {
    return w.list[1].temp.max;
  });

  FM.AddFormatTag("WFAL", "Forecast Day 1 Low", function(d, w) {
    return w.list[1].temp.min;
  });

  FM.AddFormatTag("WFACT", "Forecast Day 1 Condition Text", function(d, w) {
    return w.list[1].weather[0].main;
  });

  FM.AddFormatTag("WFACI", "Forecast Day 1 Condition Icon", function(d, w) {
    return w.list[1].weather[0].icon;
  });

  FM.AddFormatTag("WFBH", "Forecast Day 2 High", function(d, w) {
    return w.list[2].temp.max;
  });

  FM.AddFormatTag("WFBL", "Forecast Day 2 Low", function(d, w) {
    return w.list[2].temp.min;
  });

  FM.AddFormatTag("WFBCT", "Forecast Day 2 Condition Text", function(d, w) {
    return w.list[2].weather[0].main;
  });

  FM.AddFormatTag("WFBCI", "Forecast Day 2 Condition Icon", function(d, w) {
    return w.list[2].weather[0].icon;
  });

  FM.AddFormatTag("WFCH", "Forecast Day 3 High", function(d, w) {
    return w.list[3].temp.max;
  });

  FM.AddFormatTag("WFCL", "Forecast Day 3 Low", function(d, w) {
    return w.list[3].temp.min;
  });

  FM.AddFormatTag("WFCCT", "Forecast Day 3 Condition Text", function(d, w) {
    return w.list[3].weather[0].main;
  });

  FM.AddFormatTag("WFCCI", "Forecast Day 3 Condition Icon", function(d, w) {
    return w.list[3].weather[0].icon;
  });

  FM.AddFormatTag("WFDH", "Forecast Day 4 High", function(d, w) {
    return w.list[4].temp.max;
  });

  FM.AddFormatTag("WFDL", "Forecast Day 4 Low", function(d, w) {
    return w.list[4].temp.min;
  });

  FM.AddFormatTag("WFDCT", "Forecast Day 4 Condition Text", function(d, w) {
    return w.list[4].weather[0].main;
  });

  FM.AddFormatTag("WFDCI", "Forecast Day 4 Condition Icon", function(d, w) {
    return w.list[4].weather[0].icon;
  });

  FM.AddFormatTag("WFEH", "Forecast Day 5 High", function(d, w) {
    return w.list[5].temp.max;
  });

  FM.AddFormatTag("WFEL", "Forecast Day 5 Low", function(d, w) {
    return w.list[5].temp.min;
  });

  FM.AddFormatTag("WFECT", "Forecast Day 5 Condition Text", function(d, w) {
    return w.list[5].weather[0].main;
  });

  FM.AddFormatTag("WFECI", "Forecast Day 5 Condition Icon", function(d, w) {
    return w.list[5].weather[0].icon;
  });

  FM.AddFormatTag("WFFH", "Forecast Day 6 High", function(d, w) {
    return w.list[6].temp.max;
  });

  FM.AddFormatTag("WFFL", "Forecast Day 6 Low", function(d, w) {
    return w.list[6].temp.min;
  });

  FM.AddFormatTag("WFFCT", "Forecast Day 6 Condition Text", function(d, w) {
    return w.list[6].weather[0].main;
  });

  FM.AddFormatTag("WFFCI", "Forecast Day 6 Condition Icon", function(d, w) {
    return w.list[6].weather[0].icon;
  });

  FM.AddFormatTag("WFGH", "Forecast Day 7 High", function(d, w) {
    return w.list[7].temp.max;
  });

  FM.AddFormatTag("WFGL", "Forecast Day 7 Low", function(d, w) {
    return w.list[7].temp.min;
  });

  FM.AddFormatTag("WFGCT", "Forecast Day 7 Condition Text", function(d, w) {
    return w.list[7].weather[0].main;
  });

  FM.AddFormatTag("WFGCI", "Forecast Day 7 Condition Icon", function(d, w) {
    return w.list[7].weather[0].icon;
  });


  //I'm putting weather stuff here, I'm not sure if this should be 
  // broken out, but it goes with formatting

  FM.prototype.init_weather = function() {
    var fm = this;

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(fm.getLocation.bind(fm));

    } else {

      console.log("location not available, using default");

      fm._location = {
        latitude: 35,
        longitude: 139
      };

      fm.UpdateWeather();

    }

  };

  FM.prototype.getLocation = function(pos) {
    fm._location = pos.coords;

    fm.UpdateWeather();
  };

  FM.makeWeatherURL = function(coords) {
    var units = "imperial";

    return "http://api.openweathermap.org/data/2.5/forecast/daily?units=" + units + "&lat=" +
      coords.latitude + "&lon=" + coords.longitude;
  }

  FM.prototype.UpdateWeather = function() {
    var fm = this,
      url = FM.makeWeatherURL(fm._location);

    $.getJSON(url, fm.HandleWeatherResponse.bind(fm));
  };

  FM.prototype.HandleWeatherResponse = function(data, status) {
    fm._weather_data = data;
  };

})(FaceMaker)
