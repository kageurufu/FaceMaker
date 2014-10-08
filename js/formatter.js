var formatter = {};

formatter.Dy = function(str) {
	// #Dy#		Year
	// Should return "2014"
	return str.replace("#Dy#", "2014");
};

formatter.Dyy = function(str) {
	// #Dyy#		Year
	// Should return "14"
	return str.replace("#Dyy#", "14");
};

formatter.Dyyyy = function(str) {
	// #Dyyyy#		Year
	// Should return "2014"
	return str.replace("#Dyyyy#", "2014");
};

formatter.DM = function(str) {
	// #DM#		Month in Year
	// Should return "10"
	return str.replace("#DM#", "10");
};

formatter.DMM = function(str) {
	// #DMM#		Month in Year
	// Should return "10"
	return str.replace("#DMM#", "10");
};

formatter.DMMM = function(str) {
	// #DMMM#		Month in Year
	// Should return "Oct"
	return str.replace("#DMMM#", "Oct");
};

formatter.DMMMM = function(str) {
	// #DMMMM#		Month in Year
	// Should return "October"
	return str.replace("#DMMMM#", "October");
};

formatter.DW = function(str) {
	// #DW#		Week in Month
	// Should return "2"
	return str.replace("#DW#", "2");
};

formatter.Dw = function(str) {
	// #Dw#		Week in Year
	// Should return "41"
	return str.replace("#Dw#", "41");
};

formatter.DD = function(str) {
	// #DD#		Day in Year 
	// Should return "280"
	return str.replace("#DD#", "280");
};

formatter.Dd = function(str) {
	// #Dd#		Day in Month 
	// Should return "7"
	return str.replace("#Dd#", "7");
};

formatter.DE = function(str) {
	// #DE#		Day of Week 
	// Should return "Tue"
	return str.replace("#DE#", "Tue");
};

formatter.DEEEE = function(str) {
	// #DEEEE#		Day of Week 
	// Should return "Tuesday"
	return str.replace("#DEEEE#", "Tuesday");
};

formatter.DF = function(str) {
	// #DF#		Day of Week in Month
	// Should return "1"
	return str.replace("#DF#", "1");
};

formatter.Da = function(str) {
	// #Da#		AM/PM
	// Should return "PM"
	return str.replace("#Da#", "PM");
};

formatter.Dh = function(str) {
	// #Dh#		Hour in Day (1-12)
	// Should return "2"
	return str.replace("#Dh#", "2");
};

formatter.Dk = function(str) {
	// #Dk#		Hour in Day (1-24)
	// Should return "14"
	return str.replace("#Dk#", "14");
};

formatter.DH = function(str) {
	// #DH#		Hour in Day (0-23)
	// Should return "14"
	return str.replace("#DH#", "14");
};

formatter.DK = function(str) {
	// #DK#		Hour in Day (0-11)
	// Should return "2"
	return str.replace("#DK#", "2");
};

formatter.DHZ = function(str) {
	// #DHZ#		Hour in Day (leading zero) (00-23)
	// Should return "14"
	return str.replace("#DHZ#", "14");
};

formatter.DkZ = function(str) {
	// #DkZ#		Hour in Day (leading zero) (01-24)
	// Should return "14"
	return str.replace("#DkZ#", "14");
};

formatter.DKZ = function(str) {
	// #DKZ#		Hour in Day (12 hour, leading zero) (00-11)
	// Should return "02"
	return str.replace("#DKZ#", "02");
};

formatter.DhZ = function(str) {
	// #DhZ#		Hour in Day (12 hour, leading zero) (01-12)
	// Should return "02"
	return str.replace("#DhZ#", "02");
};

formatter.DhoT = function(str) {
	// #DhoT#		Value for Hour Rotation (12 hour)
	// Should return "60"
	return str.replace("#DhoT#", "60");
};

formatter.DhoTb = function(str) {
	// #DhoTb#		Value for Hour Rotation (24 hour)
	// Should return "210"
	return str.replace("#DhoTb#", "210");
};

formatter.DWFK = function(str) {
	// #DWFK#		Value for Hour Rotation (12 hour, wearface)
	// Should return "60"
	return str.replace("#DWFK#", "60");
};

formatter.DWFH = function(str) {
	// #DWFH#		Value for Hour Rotation (24 hour, wearface)
	// Should return "210"
	return str.replace("#DWFH#", "210");
};

formatter.DhT = function(str) {
	// #DhT#		String value for hour (12 hour)
	// Should return "TWO"
	return str.replace("#DhT#", "TWO");
};

formatter.DkT = function(str) {
	// #DkT#		String value for hour (24 hour)
	// Should return "FOURTEEN"
	return str.replace("#DkT#", "FOURTEEN");
};

formatter.Dm = function(str) {
	// #Dm#		Minute in Hour
	// Should return "43"
	return str.replace("#Dm#", "43");
};

formatter.DmZ = function(str) {
	// #DmZ#		Minute in Hour (leading zero)
	// Should return "43"
	return str.replace("#DmZ#", "43");
};

formatter.DmoT = function(str) {
	// #DmoT#		Value for minute hand rotation
	// Should return "258"
	return str.replace("#DmoT#", "258");
};

formatter.DWFM = function(str) {
	// #DWFM#		Value for minute hand rotation (wearface image)
	// Should return "258"
	return str.replace("#DWFM#", "258");
};

formatter.DmT = function(str) {
	// #DmT#		String value for minutes
	// Should return "FORTY THREE"
	return str.replace("#DmT#", "FORTY THREE");
};

formatter.DmMT = function(str) {
	// #DmMT#		String value for minutes (tens place)
	// Should return "FORTY"
	return str.replace("#DmMT#", "FORTY");
};

formatter.DmST = function(str) {
	// #DmST#		String value for minutes (ones place)
	// Should return "THREE"
	return str.replace("#DmST#", "THREE");
};

formatter.Ds = function(str) {
	// #Ds#		Second in minute
	// Should return "56"
	return str.replace("#Ds#", "56");
};

formatter.DsZ = function(str) {
	// #DsZ#		Second in minute (leading zero)
	// Should return "56"
	return str.replace("#DsZ#", "56");
};

formatter.DseT = function(str) {
	// #DseT#		Value for second hand rotation
	// Should return "186"
	return str.replace("#DseT#", "186");
};

formatter.DWFS = function(str) {
	// #DWFS#		Rotation value for second hand (wearface image)
	// Should return "186"
	return str.replace("#DWFS#", "186");
};

formatter.Dz = function(str) {
	// #Dz#		Timezone
	// Should return "MST"
	return str.replace("#Dz#", "MST");
};

formatter.Dzzzz = function(str) {
	// #Dzzzz#		Timezone
	// Should return "Mountain Standard Time"
	return str.replace("#Dzzzz#", "Mountain Standard Time");
};

formatter.BLP = function(str) {
	// #BLP#		Battery Level Percentage
	// Should return "95%"
	return str.replace("#BLP#", "95%");
};

formatter.BLN = function(str) {
	// #BLN#		Battery Leven Integer
	// Should return "95"
	return str.replace("#BLN#", "95");
};

formatter.BTC = function(str) {
	// #BTC#		Battery Temperature (°C)
	// Should return "31°C"
	return str.replace("#BTC#", "31°C");
};

formatter.BTI = function(str) {
	// #BTI#		Battery Temperature (°F)
	// Should return "88°F"
	return str.replace("#BTI#", "88°F");
};

formatter.BTCN = function(str) {
	// #BTCN#		Battery Temperature (Celcius)
	// Should return "31"
	return str.replace("#BTCN#", "31");
};

formatter.BTIN = function(str) {
	// #BTIN#		Battery Temperature (Fahrenheit)
	// Should return "88"
	return str.replace("#BTIN#", "88");
};

formatter.BS = function(str) {
	// #BS#		Battery Charging Status
	// Should return "Charging"
	return str.replace("#BS#", "Charging");
};

formatter.ZLP = function(str) {
	// #ZLP#		Low Power Mode
	// Should return "false"
	return str.replace("#ZLP#", "false");
};

formatter.ZSC = function(str) {
	// #ZSC#		Step Count (may not be accurate)
	// Should return "0"
	return str.replace("#ZSC#", "0");
};

formatter.WLC = function(str) {
	// #WLC#		Weather Location
	// Should return "Sam Hughes"
	return str.replace("#WLC#", "Sam Hughes");
};

formatter.WTH = function(str) {
	// #WTH#		Today's High
	// Should return "88"
	return str.replace("#WTH#", "88");
};

formatter.WTL = function(str) {
	// #WTL#		Today's Low
	// Should return "67"
	return str.replace("#WTL#", "67");
};

formatter.WCT = function(str) {
	// #WCT#		Current Temp
	// Should return "88"
	return str.replace("#WCT#", "88");
};

formatter.WCCI = function(str) {
	// #WCCI#		Current Condition Icon
	// Should return "01"
	return str.replace("#WCCI#", "01");
};

formatter.WCCT = function(str) {
	// #WCCT#		Current Condition Text
	// Should return "Fair"
	return str.replace("#WCCT#", "Fair");
};

formatter.WCHN = function(str) {
	// #WCHN#		Current Humidity Number
	// Should return "22.0"
	return str.replace("#WCHN#", "22.0");
};

formatter.WCHP = function(str) {
	// #WCHP#		Current Humidity Percentage
	// Should return "22.0%"
	return str.replace("#WCHP#", "22.0%");
};

formatter.WFAH = function(str) {
	// #WFAH#		Forecast Day 1 High
	// Should return "88"
	return str.replace("#WFAH#", "88");
};

formatter.WFAL = function(str) {
	// #WFAL#		Forecast Day 1 Low
	// Should return "67"
	return str.replace("#WFAL#", "67");
};

formatter.WFACT = function(str) {
	// #WFACT#		Forecast Day 1 Condition Text
	// Should return "Mostly cloudy"
	return str.replace("#WFACT#", "Mostly cloudy");
};

formatter.WFACI = function(str) {
	// #WFACI#		Forecast Day 1 Condition Icon
	// Should return "03"
	return str.replace("#WFACI#", "03");
};

formatter.WFBH = function(str) {
	// #WFBH#		Forecast Day 2 High
	// Should return "83"
	return str.replace("#WFBH#", "83");
};

formatter.WFBL = function(str) {
	// #WFBL#		Forecast Day 2 Low
	// Should return "64"
	return str.replace("#WFBL#", "64");
};

formatter.WFBCT = function(str) {
	// #WFBCT#		Forecast Day 2 Condition Text
	// Should return "Thunderstorms"
	return str.replace("#WFBCT#", "Thunderstorms");
};

formatter.WFBCI = function(str) {
	// #WFBCI#		Forecast Day 2 Condition Icon
	// Should return "11"
	return str.replace("#WFBCI#", "11");
};

formatter.WFCH = function(str) {
	// #WFCH#		Forecast Day 3 High
	// Should return "81"
	return str.replace("#WFCH#", "81");
};

formatter.WFCL = function(str) {
	// #WFCL#		Forecast Day 3 Low
	// Should return "62"
	return str.replace("#WFCL#", "62");
};

formatter.WFCCT = function(str) {
	// #WFCCT#		Forecast Day 3 Condition Text
	// Should return "AM Thunderstorms"
	return str.replace("#WFCCT#", "AM Thunderstorms");
};

formatter.WFCCI = function(str) {
	// #WFCCI#		Forecast Day 3 Condition Icon
	// Should return "11"
	return str.replace("#WFCCI#", "11");
};

formatter.WFDH = function(str) {
	// #WFDH#		Forecast Day 4 High
	// Should return "85"
	return str.replace("#WFDH#", "85");
};

formatter.WFDL = function(str) {
	// #WFDL#		Forecast Day 4 Low
	// Should return "60"
	return str.replace("#WFDL#", "60");
};

formatter.WFDCT = function(str) {
	// #WFDCT#		Forecast Day 4 Condition Text
	// Should return "Sunny"
	return str.replace("#WFDCT#", "Sunny");
};

formatter.WFDCI = function(str) {
	// #WFDCI#		Forecast Day 4 Condition Icon
	// Should return "01"
	return str.replace("#WFDCI#", "01");
};

formatter.WFEH = function(str) {
	// #WFEH#		Forecast Day 5 High
	// Should return "88"
	return str.replace("#WFEH#", "88");
};

formatter.WFEL = function(str) {
	// #WFEL#		Forecast Day 5 Low
	// Should return "61"
	return str.replace("#WFEL#", "61");
};

formatter.WFECT = function(str) {
	// #WFECT#		Forecast Day 5 Condition Text
	// Should return "Sunny"
	return str.replace("#WFECT#", "Sunny");
};

formatter.WFECI = function(str) {
	// #WFECI#		Forecast Day 5 Condition Icon
	// Should return "01"
	return str.replace("#WFECI#", "01");
};

formatter.WFFH = function(str) {
	// #WFFH#		Forecast Day 6 High
	// Should return "88"
	return str.replace("#WFFH#", "88");
};

formatter.WFFL = function(str) {
	// #WFFL#		Forecast Day 6 Low
	// Should return "61"
	return str.replace("#WFFL#", "61");
};

formatter.WFFCT = function(str) {
	// #WFFCT#		Forecast Day 6 Condition Text
	// Should return "Sunny"
	return str.replace("#WFFCT#", "Sunny");
};

formatter.WFFCI = function(str) {
	// #WFFCI#		Forecast Day 6 Condition Icon
	// Should return "01"
	return str.replace("#WFFCI#", "01");
};

formatter.WFGH = function(str) {
	// #WFGH#		Forecast Day 7 High
	// Should return "88"
	return str.replace("#WFGH#", "88");
};

formatter.WFGL = function(str) {
	// #WFGL#		Forecast Day 7 Low
	// Should return "61"
	return str.replace("#WFGL#", "61");
};

formatter.WFGCT = function(str) {
	// #WFGCT#		Forecast Day 7 Condition Text
	// Should return "Sunny"
	return str.replace("#WFGCT#", "Sunny");
};

formatter.WFGCI = function(str) {
	// #WFGCI#		Forecast Day 7 Condition Icon
	// Should return "01"
	return str.replace("#WFGCI#", "01");
};
