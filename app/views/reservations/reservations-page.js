var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var calendarModule = require("nativescript-ui-calendar");

var WorkersList = require("../../shared/view-models/workers-list-view-model");
var workersList =  new WorkersList();
var monthsOfYear = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

var page;
var pageData = new observableModule.fromObject({
    workersList: workersList,
    selectedIndex: 0,
    actualMonthCalendar: 0,
    calendarReservations: [],
    showFloatingButton: false
});


exports.loaded = function (args) {
    page = args.object;
    today = new Date();
    pageData.set("actualMonthCalendar", today.getMonth());
    workersList.getWorkersList();
    //setCalendarReservations();  //Carga las reservas

    page.bindingContext = pageData;
};

exports.getSelectedIndexChanged = function(args){
    const dropDown = args.object;
    pageData.set("selectedIndex", dropDown.selectedIndex);

    workersList.workersListTimeTables.forEach(function(nameTimeTable, index) {
        if(index == pageData.get("selectedIndex")){
            timeTableWorker = nameTimeTable; //alberto_rodriguez
        }    
    });

    const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")];
    workersList.getReservationsList(timeTableWorker, actualMonthReservation);
};

//Sirve para cuando estes deslizando de un mes a otro, setee la variable 'actualMonthCalendar' si es diferente mes.
exports.navigatedToDate = function(args){
    const calendar = args.object;
    const dateChanged = args.date;
    const monthOfDateChanged = dateChanged.getMonth();

    if(pageData.get("actualMonthCalendar") != monthOfDateChanged){
        pageData.set("actualMonthCalendar", monthOfDateChanged);
    }
};

// Recoge la fecha seleccionada y cambia a la vista 'Day' si estas en la vista 'Month'.
exports.onDateSelected = function(args) {
    const calendar = args.object;
    const dateSelected = args.date;
    const monthOfDateSelected = dateSelected.getMonth();
    pageData.set("actualMonthCalendar", monthOfDateSelected);
    
    if (calendar.viewMode == calendarModule.CalendarViewMode.Month) {   //Si esta en la vista 'Month' cambiará a 'Day' solamente cuando seleccione/clique una fecha.
        pageData.set("showFloatingButton", true);
        calendar.viewMode = calendarModule.CalendarViewMode.Day;
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;
    }
}

exports.changeViewMode = function(args){
    const btn = args.object;
    const viewModeBtn = btn.id;
    const calendar = page.getViewById("calendar");

    if(viewModeBtn == calendarModule.CalendarViewMode.Month.toLowerCase()){
        pageData.set("showFloatingButton", false);
        calendar.viewMode = calendarModule.CalendarViewMode.Month;
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;
    }else if(viewModeBtn == calendarModule.CalendarViewMode.Day.toLowerCase()){
        pageData.set("showFloatingButton", true);
        calendar.viewMode = calendarModule.CalendarViewMode.Day;
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;
    }else{
        pageData.set("showFloatingButton", true);
        calendar.selectedDate = new Date();
        calendar.displayedDate = new Date();
    }
}

function setCalendarReservations(){
    let reservations = [];  //El que se rellena de reservas hacia la vista calendar.
    let reservationsList = [{endDate: "", startDate:"", displayName: "Zizquito Viñuales"}]; //El que se recoge de bbdd
    let j = 1;
    for (let i = 0; i < reservationsList.length; i++) {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), j * 2);
        const endDate = new Date(now.getFullYear(), now.getMonth(), (j * 2) + (j % 3));
        const reservation = new calendarModule.CalendarEvent(reservationsList[i].displayName, startDate, endDate);
        reservations.push(reservation);
        j++;
    }
    this.set("calendarReservations", reservations);
}