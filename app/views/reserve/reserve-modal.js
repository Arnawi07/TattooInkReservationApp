const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;

const isAndroid = require("tns-core-modules/platform").isAndroid;
const isIOS = require("tns-core-modules/platform").isIOS;

var Reservations = require("../../shared/view-models/reservations-view-model");
var reservations =  new Reservations();

var pageData = new observableModule.fromObject({
  reservations : reservations,
  tattooAreas : ["Muslo","Brazo","Espalda","Hombro","Pectoral","Abdomen","Costado","Dedos","Empeine","Gemelo","Rodilla","Cara","Cabeza"]
});

var page;
var dayOfweekSelected;

exports.onShownModally = function(args) {
    const context = args.context;
    dayOfweekSelected = context.dayOfWeekSelected;
    page = args.object;

    reservations.emptyArrayInfoTattoos();
    reservations.getInfoTattoos();
    reservations.getTimeTableShop(dayOfweekSelected);

    setTimeout(function(){
      page.getViewById("timeTableshop").text = "Info. Horario: "+reservations.timeTableShop;
    },300);

    page.bindingContext = pageData;
}

exports.onNavigatedFrom = function(args) {
    if (args.isBackNavigation === true) {
        args.object.closeModal();
    }
}

exports.onPickerLoaded = function(args) {
    const timePicker = args.object;

    timePicker.hour=09;
    timePicker.minute=0;
    timePicker.minuteInterval=15;

    if (isAndroid) {
        timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
    } else if (isIOS) {
        const local = NSLocale.alloc().initWithLocaleIdentifier("ES");
        timePicker.ios.locale = local;
    }
}

exports.getSelectedIndexChanged = function(args){
  const dropDownTattooType = args.object;
  var approxPrice;

  reservations.tattooPrices.forEach(function(price, index) {
    alert(index);
    if(index == dropDownTattooType.selectedIndex){
      approxPrice = price;
    }    
  });
  page.getViewById("priceTattoo").text = 'Coste aproximado:  '+ approxPrice +'€'; 
};   

exports.makeReserve = function(args){
  const tpHour = parseInt(page.getViewById("timePicker").hour);
  const tpMin = parseInt(page.getViewById("timePicker").minute);

  
  if((dayOfweekSelected == 5 || dayOfweekSelected == 6 ) && (tpHour < 10 || tpHour >= 14)){ //Coger horarios de BBDD
    alert("Debes de seleccionar dentro del horario de apertura.");
  }else if(tpHour < 9 && tpHour >= 20){
    alert("Debes de seleccionar dentro del horario de apertura.");
  }else{
    var indexTypeTattoo = page.getViewById("dropDownType").selectedIndex;
    var durationTattoo;
    reservations.tattooDurations.forEach(function(duration, index) {
      if(index == indexTypeTattoo){
        durationTattoo = duration;
      }    
    });
    alert("DURACION DEL TATOO => "+durationTattoo);
    alert("HORA DE LA RESERVA => "+tpHour+":"+tpMin);
  }
}