var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");
var firebase = require("nativescript-plugin-firebase");

var MyReservationsList = require("../../shared/view-models/user-reservations-view-model");
var myReservationsList = new MyReservationsList();

var page;
var pageData = new observableModule.fromObject({
    myReservationsList: myReservationsList
});

exports.onLoaded = function (args) {
    page = args.object;
    page.bindingContext = pageData;

    myReservationsList.empty();
    myReservationsList.load()
        .then(function(){
            console.info("INFO: lista de mis reservas cargada");
        }).catch(function(error){
            console.error("ERROR: load() -> " + error);
        });
};

exports.deleteReserve = function (args) {
    dialogsModule.confirm({
        title: "Anular reserva",
        message: "Estás seguro de que quieres eliminar la reserva? Una vez eliminada no se puede recuperar.",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then(function (result) {
        accept = result;
        if (accept) {
            const item = args.view.bindingContext;
            const index = myReservationsList.indexOf(item);

            myReservationsList.deleteReservation(index)
                .then(function(){
                    console.info("INFO: reserva eliminada");
                }).catch(function(error){
                    console.error("ERROR: deleteReservation() -> " + error);
                });
        }
    });
}

exports.onSwipeCellStarted = function (args) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.object;
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.left = 0;
    swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
};
