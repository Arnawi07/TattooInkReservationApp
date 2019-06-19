const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
var dialogsModule = require("tns-core-modules/ui/dialogs");

const isAndroid = require("tns-core-modules/platform").isAndroid;
const isIOS = require("tns-core-modules/platform").isIOS;

var Reservations = require("../../shared/view-models/reservations-view-model");
var reservations = new Reservations();

var page;
var dayOfweekSelected;
var startDateHour;
var endDateHour;
var startDateMin;
var endDateMin;

var pageData = new observableModule.fromObject({
  reservations: reservations,
  tattooAreas: ["Muslo", "Brazo", "Espalda", "Hombro", "Pectoral", "Abdomen", "Costado", "Dedos", "Empeine", "Gemelo", "Rodilla", "Cara", "Cabeza"],
  startDateHour: startDateHour,
  startDateMin: startDateMin
});



//Parametros para el metodo de recoger las reservas del dia
var timeTableWorker;
var actualMonthReservation;
var dateOfDateSelected;
var actualYearCalendar;


exports.onShownModally = function (args) {
  const context = args.context;
  page = args.object;

  dayOfweekSelected = context.dayOfWeekSelected;
  dateOfDateSelected = context.dateOfDateSelected;
  timeTableWorker = context.timeTableWorker;
  actualMonthReservation = context.actualMonthReservation;
  actualYearCalendar = context.actualYearCalendar;

  reservations.emptyArrayInfoTattoos();
  //Posible setTimeout
  reservations.getInfoTattoos()
    .then(function(){
      console.info("INFO: listas de información de tattoos rellena");
    }).catch(function(error){
      console.error("ERROR: getInfoTattoos() -> " + error);
    });
  reservations.getTimeTableShop(dayOfweekSelected)
    .then(function(){
      console.info("INFO: horario de la tienda recogido");
    }).catch(function(error){
      console.error("ERROR: getTimeTableShop(...) -> " + error);
    });

  setTimeout(function () {
    page.getViewById("timeTableshop").text = "Info. de horario de apertura: " + reservations.timeTableShop;
    splitTimeTable = reservations.timeTableShop.split(" - ");
    startDateHour = splitTimeTable[0].substring(0, 2);
    startDateMin = splitTimeTable[0].substring(3, 5);
    endDateHour = splitTimeTable[1].substring(0, 2);    
    endDateMin = splitTimeTable[1].substring(3, 5);

    pageData.set("startDateHour", startDateHour);
    pageData.set("startDateMin", startDateMin);
  }, 800);

  page.bindingContext = pageData;
}

exports.onCloseModal = function (args) {
  args.object.closeModal();
}

exports.onNavigatedFrom = function (args) {
  if (args.isBackNavigation === true) {
    args.object.closeModal();
  }
}

exports.onPickerLoaded = function (args) {
  const timePicker = args.object;

  timePicker.minuteInterval = 15;

  if (isAndroid) {
    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
  } else if (isIOS) {
    const local = NSLocale.alloc().initWithLocaleIdentifier("ES");
    timePicker.ios.locale = local;
  }
  console.info("INFO: TimePicker cargado.");
}

exports.getSelectedIndexChanged = function (args) {
  const dropDownTattooType = args.object;
  var approxPrice;
  var duration;

  reservations.tattooPrices.forEach(function (price, index) {
    if (index == dropDownTattooType.selectedIndex) {
      approxPrice = price;
      duration = reservations.tattooDurations.getItem(index);
    }
  });
  
  page.getViewById("durationTattoo").text = 'Duración aproximada:  ' + duration + 'min.';
  page.getViewById("priceTattoo").text = 'Coste aproximado:  ' + approxPrice + '€';
};

exports.makeReserve = function (args) {
  const tpHour = parseInt(page.getViewById("timePicker").hour);
  const tpMin = parseInt(page.getViewById("timePicker").minute);
  const hour = "T00:00:00";
  const startDateSchedule = new Date(dateOfDateSelected + hour);
  const endDateSchedule = new Date(dateOfDateSelected + hour);
  const startDateSelected = new Date(dateOfDateSelected + hour);
  const todayDate = new Date();

  startDateSchedule.setHours(startDateHour);
  startDateSchedule.setMinutes(startDateMin);
  startDateSchedule.setSeconds(0);

  endDateSchedule.setHours(endDateHour);
  endDateSchedule.setMinutes(endDateMin);
  endDateSchedule.setSeconds(0);

  startDateSelected.setHours(tpHour);
  startDateSelected.setMinutes(tpMin);
  startDateSelected.setSeconds(0);

  todayDate.setHours(parseInt(todayDate.getHours() + 2 + 1)); //Puedes reservar con 1h de antelación como minimo
  if (!(startDateSelected >= startDateSchedule && startDateSelected < endDateSchedule)) {
    dialogsModule.alert({
      message: "Debes de seleccionar una hora dentro del horario de apertura.",
      okButtonText: "Vale"
    });                                                                           
  } else if(startDateSelected.getDate() == todayDate.getDate() && startDateSelected.getMonth() == todayDate.getMonth() && startDateSelected <= todayDate){
    dialogsModule.alert({
      message: "Debes de reservar con un minimo de 1h antelación.",
      okButtonText: "Vale"
    });
  } else {
    var indexTypeTattoo = page.getViewById("dropDownType").selectedIndex;
    var durationTattoo;
    var endDateSelected;
    reservations.tattooDurations.forEach(function (duration, index) {
      if (index == indexTypeTattoo) {
        durationTattoo = duration;
        endDateSelected = new Date(startDateSelected);
        endDateSelected.setMinutes(parseInt(startDateSelected.getMinutes() + durationTattoo));
      }
    });

    //Primero vacio el array de reservas
    reservations.emptyArrayReservationsCalendar();
    //Llamo al metodo para que me devuleva las reservas que hay en el dia "dateOfDateSelected";
    reservations.getReservationsListForDay(timeTableWorker, actualMonthReservation, dateOfDateSelected)
      .then(function(){
        console.info("INFO: Reservas del día recogidas.");
      }).catch(function(error){
        console.error("ERROR: getReservationsListForDay(...) -> " + error);
      });
    
    setTimeout(function () {
      var insert = true;
      var messageReserve = "";
      reservations.reservationsCalendar.forEach(function (reserve, index) {
        if (startDateSelected >= new Date(reserve.startDate) && startDateSelected < new Date(reserve.endDate)) {
          insert = false;
          messageReserve = "La reserva coincide con la reserva de otro usuario.";
        } else if (endDateSelected > new Date(reserve.startDate) && endDateSelected <= new Date(reserve.endDate)) {
          insert = false;
          messageReserve = "La reserva coincide con la reserva de otro usuario.";
        }         
      });
      if (insert && endDateSelected > endDateSchedule) {
        insert = false;
        messageReserve = "La reserva se pasa del horario de cierre de la tienda.";
      }
      //hasta que no se seleccione el tamaño del tatto no se puede clicar "RESERVAR"

      if (insert) {
        reservations.getCurrentUser()
          .then(function (user) {
              const startDateFormatSelected = formatDate(startDateSelected);
              const endDateFormatSelected = formatDate(endDateSelected);

              reservations.putReserveIntoDay(timeTableWorker, actualMonthReservation, dateOfDateSelected, user.displayName, endDateFormatSelected, startDateFormatSelected, user.uid, user.email)
                .then(function(){
                  console.info("INFO: Reserva completada.");
                  messageReserve = "Reserva completada correctamente para la fecha: " + formatDateClient(startDateSelected);
                  dialogsModule.alert({
                    message: messageReserve,
                    okButtonText: "Vale"
                  });
                })
                .catch(function (error) {
                  console.error("ERROR: putReserveIntoDay(...) -> " + error);
                });
          });
      } else {
        dialogsModule.alert({
          message: messageReserve,
          okButtonText: "Vale"
        });
      }
    }, 300);
  }
}

function formatDate(date) {
  const dayOfStartDateSelected = parseInt(date.getDate()) < 10 ? "0" + parseInt(date.getDate()) : parseInt(date.getDate());
  const monthOfStartDateSelected = parseInt(date.getMonth() + 1) < 10 ? "0" + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
  const hourOfStartDateSelected = parseInt(date.getHours()) < 10 ? "0" + parseInt(date.getHours()) : parseInt(date.getHours());
  const minutesOfStartDateSelected = parseInt(date.getMinutes()) < 10 ? "0" + parseInt(date.getMinutes()) : parseInt(date.getMinutes());
  const secondsOfStartDateSelected = parseInt(date.getSeconds()) < 10 ? "0" + parseInt(date.getSeconds()) : parseInt(date.getSeconds());

  return date.getFullYear() + "-" + monthOfStartDateSelected + "-" + dayOfStartDateSelected + "T" + hourOfStartDateSelected + ":" + minutesOfStartDateSelected + ":" + secondsOfStartDateSelected;
}

function formatDateClient(date) {
  const dayOfStartDateSelected = parseInt(date.getDate()) < 10 ? "0" + parseInt(date.getDate()) : parseInt(date.getDate());
  const monthOfStartDateSelected = parseInt(date.getMonth() + 1) < 10 ? "0" + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
  const hourOfStartDateSelected = parseInt(date.getHours()) < 10 ? "0" + parseInt(date.getHours()) : parseInt(date.getHours());
  const minutesOfStartDateSelected = parseInt(date.getMinutes()) < 10 ? "0" + parseInt(date.getMinutes()) : parseInt(date.getMinutes());
  
  var conector = "";
  if(hourOfStartDateSelected == 13){
    conector = "a la";
  }else{
    conector = "a las";
  }

  return String(dayOfStartDateSelected + "-" + monthOfStartDateSelected + "-" + date.getFullYear() + " " + conector + " " + hourOfStartDateSelected + ":" + minutesOfStartDateSelected + "h");
}