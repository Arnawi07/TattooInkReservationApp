var observableModule = require("tns-core-modules/data/observable");
var calendarModule = require("nativescript-ui-calendar");

//var cal = new observableModule.fromObject({
//    dayViewStyle: ""
//});

exports.loaded = function (args) {
    page = args.object;
    //cal.dayViewStyle = CalendarStylesServiceInstance.getDayViewStyle();
    //page.bindingContext = cal;
};

exports.onDateSelected = function(args) {
    const calendar = args.object;
       
    if (calendar.viewMode == "Month") {
        calendar.viewMode = calendarModule.CalendarViewMode.Day;
        //calendar.dayViewStyle = changeToDayViewStyle();
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;
    }
}
function changeToDayViewStyle(){
    const dayEventsViewStyle = new DayEventsViewStyle();
    dayEventsViewStyle.timeLabelFormat = "HH:mm";
    dayViewStyle.dayEventsViewStyle = dayEventsViewStyle;
    return dayViewStyle;
}

exports.changeToDayViewStyle = changeToDayViewStyle;
/*

let constructorCalled = false;
let CalendarStylesService  = java.lang.Object({
     /*_brownColor : new Color("#745151"),
     _lightYellowColor : new Color("#f1e8ca"),
     _greenBlueColor : new Color("#66bbae"),
     _darkBrownColor : new Color("#5b391e"),
     _lightGreenColor : new Color("#9ebd9e"),
     _orangeColor : new Color("#dd855c"),
     _lightBrownColor : new Color("#dbcbbb"),
     _lightGrayColor : new Color("#bbcbdb"),
     _lightBlueColor : new Color("#B5B5F9"),
     _brightBlueColor : new Color("#0023ff"),
     _cyanColor : new Color("#00ffff"),
     _whiteColor : new Color("White"),
     _blackColor : new Color("Black"),
     _grayColor : new Color("Gray"),
     _redColor : new Color("Red"),
     _blueColor : new Color("Blue"),
     _blueVioletColor : new Color("BlueViolet"),
     _preferredFontName : "Times New Roman",

     // constructor
    init: function() {
        constructorCalled = true;
    },

    getDayViewStyle: function() {
        const dayViewStyle = new CalendarDayViewStyle();
        //dayViewStyle.backgroundColor = this._orangeColor;
        dayViewStyle.showWeekNumbers = true;
        dayViewStyle.showDayNames = true;
        dayViewStyle.showTitle = true;

        const todayCellStyle = new DayCellStyle();
        //todayCellStyle.cellBackgroundColor = this._orangeColor;
        todayCellStyle.cellBorderWidth = 1;
        //todayCellStyle.cellBorderColor = this._lightYellowColor;
        //todayCellStyle.cellTextColor = this._brownColor;
        //todayCellStyle.cellTextFontName = this._preferredFontName;
        //todayCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        todayCellStyle.cellTextSize = 14;
        //dayViewStyle.todayCellStyle = todayCellStyle;

        const dayCellStyle = new DayCellStyle();
        dayCellStyle.showEventsText = true;
        //dayCellStyle.eventTextColor = this._whiteColor;
        //dayCellStyle.eventFontName = this._preferredFontName;
        //dayCellStyle.eventFontStyle = CalendarFontStyle.BoldItalic;
        dayCellStyle.eventTextSize = 8;
        //dayCellStyle.cellAlignment = CalendarCellAlignment.VerticalCenter;
        dayCellStyle.cellPaddingHorizontal = 10;
        dayCellStyle.cellPaddingVertical = 5;
        //dayCellStyle.cellBackgroundColor = this._lightGreenColor;
        dayCellStyle.cellBorderWidth = 1;
        //dayCellStyle.cellBorderColor = this._lightYellowColor;
        //dayCellStyle.cellTextColor = this._brownColor;
        //dayCellStyle.cellTextFontName = this._preferredFontName;
        //dayCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        dayCellStyle.cellTextSize = 10;
        dayViewStyle.dayCellStyle = dayCellStyle;

        const weekendCellStyle = new DayCellStyle();
        //weekendCellStyle.eventTextColor = this._blueVioletColor;
        //weekendCellStyle.eventFontName = this._preferredFontName;
        //weekendCellStyle.eventFontStyle = CalendarFontStyle.BoldItalic;
        weekendCellStyle.eventTextSize = 8;
        //weekendCellStyle.cellAlignment = CalendarCellAlignment.VerticalCenter;
        weekendCellStyle.cellPaddingHorizontal = 10;
        weekendCellStyle.cellPaddingVertical = 5;
        //weekendCellStyle.cellBackgroundColor = this._lightYellowColor;
        weekendCellStyle.cellBorderWidth = 1;
        //weekendCellStyle.cellBorderColor = this._lightYellowColor;
        //weekendCellStyle.cellTextColor = this._brownColor;
        //weekendCellStyle.cellTextFontName = this._preferredFontName;
        //weekendCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        weekendCellStyle.cellTextSize = 12;
        dayViewStyle.weekendCellStyle = weekendCellStyle;

        const selectedCellStyle = new DayCellStyle();
        //selectedCellStyle.eventTextColor = this._blueColor;
        //selectedCellStyle.eventFontName = this._preferredFontName;
        //selectedCellStyle.eventFontStyle = CalendarFontStyle.Bold;
        selectedCellStyle.eventTextSize = 8;
        //selectedCellStyle.cellAlignment = CalendarCellAlignment.VerticalCenter;
        selectedCellStyle.cellPaddingHorizontal = 10;
        selectedCellStyle.cellPaddingVertical = 5;
        //selectedCellStyle.cellBackgroundColor = this._brownColor;
        selectedCellStyle.cellBorderWidth = 2;
        //selectedCellStyle.cellBorderColor = this._lightYellowColor;
        //selectedCellStyle.cellTextColor = this._blackColor;
        //selectedCellStyle.cellTextFontName = this._preferredFontName;
        //selectedCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        selectedCellStyle.cellTextSize = 18;
        dayViewStyle.selectedDayCellStyle = selectedCellStyle;

        const weekNumberCellStyle = new CellStyle();
        //weekNumberCellStyle.cellBackgroundColor = this._lightGrayColor;
        weekNumberCellStyle.cellBorderWidth = 1;
        //weekNumberCellStyle.cellBorderColor = this._lightYellowColor;
        //weekNumberCellStyle.cellTextColor = this._brownColor;
        //weekNumberCellStyle.cellTextFontName = this._preferredFontName;
        //weekNumberCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        weekNumberCellStyle.cellTextSize = 8;
        dayViewStyle.weekNumberCellStyle = weekNumberCellStyle;

        const dayNameCellStyle = new CellStyle();
        //dayNameCellStyle.cellBackgroundColor = this._lightYellowColor;
        dayNameCellStyle.cellBorderWidth = 1;
        //dayNameCellStyle.cellBorderColor = this._brownColor;
        //dayNameCellStyle.cellTextColor = this._brownColor;
        //dayNameCellStyle.cellTextFontName = this._preferredFontName;
        //dayNameCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        dayNameCellStyle.cellTextSize = 10;
        dayViewStyle.dayNameCellStyle = dayNameCellStyle;

        const titleCellStyle = new DayCellStyle();
        //titleCellStyle.cellBackgroundColor = this._orangeColor;
        titleCellStyle.cellBorderWidth = 1;
        //titleCellStyle.cellBorderColor = this._lightYellowColor;
        //titleCellStyle.cellTextColor = this._brownColor;
        //titleCellStyle.cellTextFontName = this._preferredFontName;
        //titleCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
        titleCellStyle.cellTextSize = 18;
        dayViewStyle.titleCellStyle = titleCellStyle;

        const dayEventsViewStyle = new DayEventsViewStyle();
        //dayEventsViewStyle.backgroundColor = this._lightBlueColor;
        dayEventsViewStyle.timeLabelFormat = "HH:mm";
        //dayEventsViewStyle.timeLabelTextColor = this._brightBlueColor;
        dayEventsViewStyle.timeLabelTextSize = 12;
        dayViewStyle.dayEventsViewStyle = dayEventsViewStyle;

        const allDayEventsViewStyle = new AllDayEventsViewStyle();
        //allDayEventsViewStyle.backgroundColor = this._cyanColor;
        allDayEventsViewStyle.allDayText = "DAILY";
        allDayEventsViewStyle.allDayTextIsVisible = true;
        dayViewStyle.allDayEventsViewStyle = allDayEventsViewStyle;

        return dayViewStyle;
    }
})

let CalendarStylesServiceInstance = new CalendarStylesService();
*/