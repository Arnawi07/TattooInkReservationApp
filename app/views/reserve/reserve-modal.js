const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;

const isAndroid = require("tns-core-modules/platform").isAndroid;
const isIOS = require("tns-core-modules/platform").isIOS;

var Reservations = require("../../shared/view-models/reservations-view-model");
var reservations = new Reservations();

var pageData = new observableModule.fromObject({
  reservations: reservations,
  tattooAreas: ["Muslo", "Brazo", "Espalda", "Hombro", "Pectoral", "Abdomen", "Costado", "Dedos", "Empeine", "Gemelo", "Rodilla", "Cara", "Cabeza"]
});

var page;
var dayOfweekSelected;
var startDateHour;
var endDateHour;
var startDateMin;
var endDateMin;

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
  reservations.getInfoTattoos();
  reservations.getTimeTableShop(dayOfweekSelected);

  setTimeout(function () {
    page.getViewById("timeTableshop").text = "Info. Horario: " + reservations.timeTableShop;
    splitTimeTable = reservations.timeTableShop.split(" - ");
    startDateHour = splitTimeTable[0].substring(0, 2);
    endDateHour = splitTimeTable[1].substring(0, 2);
    startDateMin = splitTimeTable[0].substring(3, 5);
    endDateMin = splitTimeTable[1].substring(3, 5);
  }, 500);

  page.bindingContext = pageData;
}

exports.onNavigatedFrom = function (args) {
  if (args.isBackNavigation === true) {
    args.object.closeModal();
  }
}

exports.onPickerLoaded = function (args) {
  const timePicker = args.object;

  timePicker.hour = 10;
  timePicker.minute = 0;
  timePicker.minuteInterval = 15;

  if (isAndroid) {
    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
  } else if (isIOS) {
    const local = NSLocale.alloc().initWithLocaleIdentifier("ES");
    timePicker.ios.locale = local;
  }
}

exports.getSelectedIndexChanged = function (args) {
  const dropDownTattooType = args.object;
  var approxPrice;

  reservations.tattooPrices.forEach(function (price, index) {
    if (index == dropDownTattooType.selectedIndex) {
      approxPrice = price;
    }
  });
  page.getViewById("priceTattoo").text = 'Coste aproximado:  ' + approxPrice + '€';
};

exports.makeReserve = function (args) {
  const tpHour = parseInt(page.getViewById("timePicker").hour);
  const tpMin = parseInt(page.getViewById("timePicker").minute);
  const hour = "T00:00:00";

  startDateSchedule = new Date(dateOfDateSelected + hour);
  endDateSchedule = new Date(dateOfDateSelected + hour);
  startDateSelected = new Date(dateOfDateSelected + hour);
  //startDateSelected = new Date(dateOfDateSelected + hour);

  startDateSchedule.setHours(startDateHour);
  startDateSchedule.setMinutes(startDateMin);
  startDateSchedule.setSeconds(0);

  endDateSchedule.setHours(endDateHour);
  endDateSchedule.setMinutes(endDateMin);
  endDateSchedule.setSeconds(0);

  startDateSelected.setHours(tpHour);
  startDateSelected.setMinutes(tpMin);
  startDateSelected.setSeconds(0);

  if (!(startDateSelected >= startDateSchedule && startDateSelected < endDateSchedule)) {
    alert("Debes de seleccionar una hora dentro del horario de apertura.");
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
    reservations.getReservationsListForDay(timeTableWorker, actualMonthReservation, dateOfDateSelected);

    setTimeout(function () {
      var insert = true;
      reservations.reservationsCalendar.forEach(function (reserve, index) {
        //console.log(startDateSelected + ">=" + new Date(reserve.startDate) + "&&" + startDateSelected +"<" + new Date(reserve.endDate));
        if (startDateSelected >= new Date(reserve.startDate) && startDateSelected < new Date(reserve.endDate)) {
          insert = false;
        }
        //console.log(endDateSelected + ">=" + new Date(reserve.startDate) + "&&" + endDateSelected +"<" + new Date(reserve.endDate));
        if (endDateSelected > new Date(reserve.startDate) && endDateSelected <= new Date(reserve.endDate)) {
          insert = false;
        }
        if (endDateSelected > endDateSchedule) {
          insert = false;
        }
      });
      //COMRPOBAR QUE NO SE SALGA DE LAS HORAS DE TRABAJO!!!
      //hasta que no se seleccione el tamaño del tatto no se puede clicar "RESERVAR"

      if (insert) {
        alert("ESTOY GRABANDO");
        reservations.getCurrentUser()
          .then(function (user) {
              const startDateFormatSelected = formatDate(startDateSelected);
              //alert("startDateFormatSelected => "+startDateFormatSelected);

              const endDateFormatSelected = formatDate(endDateSelected);
              //alert("endDateFormatSelected => "+endDateFormatSelected);
              //alert("timeTableWorker => " + timeTableWorker);
              //alert("actualMonthReservation => " + actualMonthReservation);
              //alert("dateOfDateSelected => " + dateOfDateSelected);
              reservations.putReserveIntoDay(timeTableWorker, actualMonthReservation, dateOfDateSelected, user.displayName, endDateFormatSelected, startDateFormatSelected, user.uid, user.email).catch(function (error) {
                alert("Error => " + error);
              });
          });
      } else {
        alert("Tu reserva coincide con la reserva de otro usuario.");
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