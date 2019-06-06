var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var calendarModule = require("nativescript-ui-calendar");
var timerModule = require("tns-core-modules/timer");

var WorkersList = require("../../shared/view-models/workers-list-view-model");
var workersList =  new WorkersList();
var monthsOfYear = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

var page;
var pageData = new observableModule.fromObject({
    workersList: workersList,
    selectedIndex: 0,
    actualMonthCalendar: 0,
    timeTableWorker : "",
    showFloatingButton: false
});

exports.loaded = function (args) {
    page = args.object;
    today = new Date();
    pageData.set("actualMonthCalendar", today.getMonth()); //Se settea la variable del mes al mes actual.
    workersList.getWorkersList(); //Se rellenan las listas de los nombres de los trabajadores y de sus timeTables.
    
    page.bindingContext = pageData;
};


exports.getSelectedIndexChanged = function(args){
    const dropDown = args.object;
    pageData.set("selectedIndex", dropDown.selectedIndex);//Se recoge el indice del drop down y se settea en la variable "selectedIndex"

    //Hace un for para recoger el nombre de la tabla del trabajador en funcion del indice seleccionado.
    workersList.workersListTimeTables.forEach(function(nameTimeTable, index) {
        if(index == pageData.get("selectedIndex")){
            pageData.set("timeTableWorker", nameTimeTable); 
        }    
    });

    const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")]; //Cuando se cambia el tatuador, se recoge el mes en el que esta el usuario y se coge el nombre del mes.  
    workersList.getReservationsListForMonth(pageData.get("timeTableWorker"), actualMonthReservation);  //Se llama a la funcion para que se rellene la lista con las reservas de ese mes y de ese trabajador.
    setTimeout(function(){
        setCalendarReservations(); //Con la lista de las reservas rellena, se rellena el calendario con las reservas de ese mes
    }, 400);  
};      

//Sirve para cuando estes deslizando de un mes a otro, setee la variable 'actualMonthCalendar' si es diferente mes.
exports.navigatedToDate = function(args){
    const calendar = args.object;
    const dateChanged = args.date;
    const monthOfDateChanged = dateChanged.getMonth();
    
    //Mirar si el "timeTableWorker" es vacio o no
    if(pageData.get("actualMonthCalendar") != monthOfDateChanged){
        pageData.set("actualMonthCalendar", monthOfDateChanged);
        const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")]; //Se recoge el mes previamente setteado y se coge el nombre del mes.
        //workersList.getReservationsListForMonth(pageData.get("timeTableWorker"), actualMonthReservation); //Se llama a la funcion para que se rellene la lista con las reservas de ese mes y de ese trabajador.
        //setCalendarReservations(); //Con la lista de las reservas rellena, se rellena el calendario con las reservas de ese mes.
    }
};

//Recoge la fecha seleccionada y cambia a la vista 'Day' si estas en la vista 'Month'.
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

    workersList.reservationsCalendar.forEach(function(reserve) {
        const startDate = new Date(reserve.startDate);
        const endDate = new Date(reserve.endDate);      

        const reservation = new calendarModule.CalendarEvent(reserve.displayName, startDate, endDate);
        reservations.push(reservation);
    });
    
    pageData.set("calendarReservations", reservations);
}