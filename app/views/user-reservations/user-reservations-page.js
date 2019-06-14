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

exports.loaded = function (args) {
    page = args.object;
    page.bindingContext = pageData;
    //page.bindingContext = home;

    myReservationsList.empty();
    //pageData.set("isLoading", true);

    myReservationsList.load();
};

exports.delete = function (args) {
    dialogsModule.confirm({
        title: "Anular reserva",
        message: "Estás seguro de que quieres eliminar la reserva? Una vez eliminada no se puede recuperar.",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then(function (result) {
        accept = result;
        if (accept) {
            var item = args.view.bindingContext;
            var index = myReservationsList.indexOf(item);

            myReservationsList.deleteReservation(index);
        }
    });
}

exports.onSwipeCellStarted = function (args) {
    var swipeLimits = args.data.swipeLimits;
    var swipeView = args.object;
    var rightItem = swipeView.getViewById('delete-view');
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.left = 0;
    swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
};

exports.signOut = function (args) {
    firebase.logout()
        .then(function () {
            console.info("INFO: Sesión cerrada.");
            const button = args.object;
            const page = button.page;
            const myFrame = page.frame;
            const navigationEntry = {
                moduleName: "views/login/login-page",
                clearHistory: true //Este atributo es super importante, ya que sin él, el historial no se limpia y cuando cierres sesion y tires hacia atras te volvera a la aplicacion sin tener que iniciar sesion
            };
            myFrame.navigate(navigationEntry);
        }, function (error) {
            console.error("ERROR: signOut() -> " + error);
        });
}
