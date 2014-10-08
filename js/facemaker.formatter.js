(function(FM) {
  var m_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var m_names_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  FM.prototype.tags_replacer = function(full_match, match) {
    var d = new Date();

    switch(match) {
      case "Dy": // Year
      case "Dyyyy": // Year
      return d.getFullYear();
      case "Dyy": // Year
      return d.getFullYear() % 100;
      case "DM": // Month in Year
      case "DMM": // Month in Year
      return d.getMonth() + 1;
      case "DMMM": // Month in Year
      return m_names_short[d.getMonth()];
      case "DMMMM": // Month in Year
      return m_names[d.getMonth()];
      case "DW": // Week in Month
      return (0 | d.getDate() / 7) + 1;
      case "Dw": // Week in Year
      return "41";
      case "DD": // Day in Year 
      return "280";
      case "Dd": // Day in Month 
      return "7";
      case "DE": // Day of Week 
      return "Tue";
      case "DEEEE": // Day of Week 
      return "Tuesday";
      case "DF": // Day of Week in Month
      return "1";
      case "Da": // AM/PM
      return "PM";
      case "Dh": // Hour in Day (1-12)
      return "2";
      case "Dk": // Hour in Day (1-24)
      return "14";
      case "DH": // Hour in Day (0-23)
      return d.getHours();
      case "DK": // Hour in Day (0-11)
      return d.getHours();
      case "DHZ": // Hour in Day (leading zero) (00-23)
      return d.getHours();
      case "DkZ": // Hour in Day (leading zero) (01-24)
      return d.getHours();
      case "DKZ": // Hour in Day (12 hour, leading zero) (00-11)
      return "02";
      case "DhZ": // Hour in Day (12 hour, leading zero) (01-12)
      return "02";
      case "DhoT": // Value for Hour Rotation (12 hour)
      return "60";
      case "DhoTb": // Value for Hour Rotation (24 hour)
      return "210";
      case "DWFK": // Value for Hour Rotation (12 hour, wearface)
      return "60";
      case "DWFH": // Value for Hour Rotation (24 hour, wearface)
      return "210";
      case "DhT": // String value for hour (12 hour)
      return "TWO";
      case "DkT": // String value for hour (24 hour)
      return "FOURTEEN";
      case "Dm": // Minute in Hour
      return d.getMinutes();
      case "DmZ": // Minute in Hour (leading zero)
      return d.getMinutes();
      case "DmoT": // Value for minute hand rotation
      return "258";
      case "DWFM": // Value for minute hand rotation (wearface image)
      return "258";
      case "DmT": // String value for minutes
      return "FORTY THREE";
      case "DmMT": // String value for minutes (tens place)
      return "FORTY";
      case "DmST": // String value for minutes (ones place)
      return "THREE";
      case "Ds": // Second in minute
      return d.getSeconds();
      case "DsZ": // Second in minute (leading zero)
      return d.getSeconds();
      case "DseT": // Value for second hand rotation
      return Math.floor(d.getSeconds() * 6 * Math.PI / 180);
      case "DWFS": // Rotation value for second hand (wearface image)
      return "186";
      case "Dz": // Timezone
      return "MST";
      case "Dzzzz": // Timezone
      return "Mountain Standard Time";
      case "BLP": // Battery Level Percentage
      return "95%";
      case "BLN": // Battery Leven Integer
      return "95";
      case "BTC": // Battery Temperature (°C)
      return "31°C";
      case "BTI": // Battery Temperature (°F)
      return "88°F";
      case "BTCN": // Battery Temperature (Celcius)
      return "31";
      case "BTIN": // Battery Temperature (Fahrenheit)
      return "88";
      case "BS": // Battery Charging Status
      return "Charging";
      case "ZLP": // Low Power Mode
      return "false";
      case "ZSC": // Step Count (may not be accurate)
      return "0";
      case "WLC": // Weather Location
      return "Sam Hughes";
      case "WTH": // Today's High
      return "88";
      case "WTL": // Todays' Low
      return "67";
      case "WCT": // Current Temp
      return "88";
      case "WCCI": // Current Condition Icon
      return "01";
      case "WCCT": // Current Condition Text
      return "Fair";
      case "WCHN": // Current Humidity Number
      return "22.0";
      case "WCHP": // Current Humidity Percentage
      return "22.0%";
      case "WFAH": // Forecast Day 1 High
      return "88";
      case "WFAL": // Forecast Day 1 Low
      return "67";
      case "WFACT": // Forecast Day 1 Condition Text
      return "Mostly cloudy";
      case "WFACI": // Forecast Day 1 Condition Icon
      return "03";
      case "WFBH": // Forecast Day 2 High
      return "83";
      case "WFBL": // Forecast Day 2 Low
      return "64";
      case "WFBCT": // Forecast Day 1 Condition Text
      return "Thunderstorms";
      case "WFBCI": // Forecast Day 1 Condition Icon
      return "11";
      case "WFCH": // Forecast Day 1 High
      return "81";
      case "WFCL": // Forecast Day 1 Low
      return "62";
      case "WFCCT": // Forecast Day 1 Condition Text
      return "AM Thunderstorms";
      case "WFCCI": // Forecast Day 1 Condition Icon
      return "11";
      case "WFDH": // Forecast Day 1 High
      return "85";
      case "WFDL": // Forecast Day 1 Low
      return "60";
      case "WFDCT": // Forecast Day 1 Condition Text
      return "Sunny";
      case "WFDCI": // Forecast Day 1 Condition Icon
      return "01";
      case "WFEH": // Forecast Day 1 High
      return "88";
      case "WFEL": // Forecast Day 1 Low
      return "61";
      case "WFECT": // Forecast Day 1 Condition Text
      return "Sunny";
      case "WFECI": // Forecast Day 1 Condition Icon
      return "01";
      case "WFFH": // Forecast Day 1 High
      return "88";
      case "WFFL": // Forecast Day 1 Low
      return "61";
      case "WFFCT": // Forecast Day 1 Condition Text
      return "Sunny";
      case "WFFCI": // Forecast Day 1 Condition Icon
      return "01";
      case "WFGH": // Forecast Day 1 High
      return "88";
      case "WFGL": // Forecast Day 1 Low
      return "61";
      case "WFGCT": // Forecast Day 1 Condition Text
      return "Sunny";
      case "WFGCI": // Forecast Day 1 Condition Icon
      return "01";
      default:
      return "#" + match + "#";
    }

    return "0";
  };
})(FaceMaker)