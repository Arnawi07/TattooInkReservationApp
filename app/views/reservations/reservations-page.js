var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var calendarModule = require("nativescript-ui-calendar");
var timerModule = require("tns-core-modules/timer");
const Color = require("color").Color;

var Reservations = require("../../shared/view-models/reservations-view-model");
var reservations =  new Reservations();
var monthsOfYear = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

var page;
var pageData = new observableModule.fromObject({
    reservations: reservations,
    selectedIndex: 0,
    actualMonthCalendar: 0,
    actualYearCalendar: 0,
    timeTableWorker : "",
    showFloatingButton: false,
    uid: ""
});

exports.loadedReservation = function (args) {
    //alert("loadedReservation");
    page = args.object;
    today = new Date();
    reservations.emptyArrays();
    pageData.set("actualMonthCalendar", today.getMonth()); //Se settea la variable del mes al mes actual.
    pageData.set("actualYearCalendar", today.getFullYear()); //Se settea la variable del mes al mes actual.
    //setTimeout(function(){
        reservations.getWorkersList(); //Se rellenan las listas de los nombres de los trabajadores y de sus timeTables.
    //}, 400);
    
    
    page.bindingContext = pageData;
};


exports.getSelectedIndexChanged = function(args){
    const dropDown = args.object;
    pageData.set("selectedIndex", dropDown.selectedIndex);//Se recoge el indice del drop down y se settea en la variable "selectedIndex"

    //Hace un for para recoger el nombre de la tabla del trabajador en funcion del indice seleccionado.
    reservations.workersListTimeTables.forEach(function(nameTimeTable, index) {
        if(index == pageData.get("selectedIndex")){
            pageData.set("timeTableWorker", nameTimeTable); 
        }    
    });

    const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")]; //Cuando se cambia el tatuador, se recoge el mes en el que esta el usuario y se coge el nombre del mes.  
    const actualYearReservation = pageData.get("actualYearCalendar");
    reservations.getReservationsListForMonth(pageData.get("timeTableWorker"), actualMonthReservation, actualYearReservation);  //Se llama a la funcion para que se rellene la lista con las reservas de ese mes y de ese trabajador.
    setTimeout(function(){
        setCalendarReservations(); //Con la lista de las reservas rellena, se rellena el calendario con las reservas de ese mes
    }, 400); 
};      

//Sirve para cuando estes deslizando de un mes a otro, setee la variable 'actualMonthCalendar' si es diferente mes.
exports.navigatedToDate = function(args){
    const calendar = args.object;
    const dateChanged = args.date;
    const monthOfDateChanged = dateChanged.getMonth();
    const yearOfDateChanged = dateChanged.getFullYear();

    //alert("monthChanged: " + monthOfDateChanged + "monthActual: " + pageData.get("actualMonthCalendar"));
    //Mirar si el "timeTableWorker" es vacio o no
    if(pageData.get("actualMonthCalendar") != monthOfDateChanged || pageData.get("actualYearCalendar") != yearOfDateChanged && calendar.viewMode != calendarModule.CalendarViewMode.Year){
        pageData.set("actualYearCalendar", yearOfDateChanged);
        pageData.set("actualMonthCalendar", monthOfDateChanged);

       
        const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")]; //Se recoge el mes previamente setteado y se coge el nombre del mes.
        reservations.getReservationsListForMonth(pageData.get("timeTableWorker"), actualMonthReservation, pageData.get("actualYearCalendar")); //Se llama a la funcion para que se rellene la lista con las reservas de ese mes y de ese trabajador.        
        setTimeout(function(){
            setCalendarReservations(); //Con la lista de las reservas rellena, se rellena el calendario con las reservas de ese mes
        }, 400);     
    }
    
    
};

//Recoge la fecha seleccionada y cambia a la vista 'Day' si estas en la vista 'Month'.
exports.onDateSelected = function(args) {
    const calendar = args.object;
    const dateSelected = args.date;
    //pageData.set("actualMonthCalendar", monthOfDateSelected);
    //pageData.set("actualYearCalendar", yearOfDateSelected);
    
    if (calendar.viewMode == calendarModule.CalendarViewMode.Month) {   //Si esta en la vista 'Month' cambiará a 'Day' solamente cuando seleccione/clique una fecha.
        pageData.set("showFloatingButton", true);
        calendar.viewMode = calendarModule.CalendarViewMode.Day;
        calendar.selectedDate = args.date;
        calendar.displayedDate = args.date;        
    }

    /**
        const dayOfDateSelected = dateSelected.getDate();
        const monthOfDateSelected = parseInt(dateSelected.getMonth()+1) < 10 ? "0" + parseInt(dateSelected.getMonth()+1) : parseInt(dateSelected.getMonth()+1);
        const yearOfDateSelected = dateSelected.getFullYear();
        var dateOfDateSelected = yearOfDateSelected + "-" + monthOfDateSelected + "-" + dayOfDateSelected;
        console.log("timeT; "+ pageData.get("timeTableWorker"));
        if(pageData.get("timeTableWorker") !== ""){
            reservations.emptyArrays();
            console.log("date; "+ dateOfDateSelected);
            const actualMonthReservation = monthsOfYear[pageData.get("actualMonthCalendar")]; //Cuando se cambia el tatuador, se recoge el mes en el que esta el usuario y se coge el nombre del mes.  
            console.log("date; "+ actualMonthReservation);
            reservations.getReservationsListForMonth(pageData.get("timeTableWorker"), actualMonthReservation, dateOfDateSelected);  //Se llama a la funcion para que se rellene la lista con las reservas de ese mes y de ese trabajador.
            setTimeout(function(){
                setCalendarReservations(); //Con la lista de las reservas rellena, se rellena el calendario con las reservas de ese mes
            }, 400); 
        }else{
            alert("Debes seleccionar un tatuador.");
        }
     */
    
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
    let reservationsList = [];  //El que se rellena de reservas hacia la vista calendar.
    reservations.getCurrentUserUid()
        .then(function(uid){
            uidC = uid;
            reservations.reservationsCalendar.forEach(function(reserve) {
                const startDate = new Date(reserve.startDate);
                const endDate = new Date(reserve.endDate);        
        
                //alert(uid);
                if(uid == reserve.uidClient){
                    title = reserve.displayName;
                    color = new Color("#5abfce");
                }else{
                    title = "Reservado";
                    color = new Color("#e57283");
                }
        
                const reservation = new calendarModule.CalendarEvent(title, startDate, endDate, false, color);
                reservationsList.push(reservation);
            });
            pageData.set("calendarReservations", reservationsList);
        });    
}