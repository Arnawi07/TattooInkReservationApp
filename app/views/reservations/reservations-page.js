var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var calendarModule = require("nativescript-ui-calendar");

var WorkersList = require("../../shared/view-models/workers-list-view-model");
var workersList =  new WorkersList();


var pageData = new observableModule.fromObject({
    workersList: workersList
});


exports.loaded = function (args) {
    page = args.object;
    workersList.getWorkersList();
    page.bindingContext = pageData;
};

exports.onDateSelected = function(args) {
    const calendar = args.object;
       
    if (calendar.viewMode == calendarModule.CalendarViewMode.Month) {
        calendar.viewMode = calendarModule.CalendarViewMode.Day;
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;
    }
}

function setCalendarReservations(){
    let reservations = [];
    let j = 1;
    for (let i = 0; i < reservationsList.length; i++) {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), j * 2);
        const endDate = new Date(now.getFullYear(), now.getMonth(), (j * 2) + (j % 3));
        const reservation = new calendarModule.CalendarEvent(reservationsList[i], startDate, endDate);
        reservations.push(reservation);
        j++;
    }
    this.set("calendarReservations", reservations);
}