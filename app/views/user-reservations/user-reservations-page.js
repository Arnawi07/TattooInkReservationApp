var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");

var MyReservationsList = require("../../shared/view-models/user-reservations-view-model");
var myReservationsList = new MyReservationsList([]);

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
    myReservationsList.load().then(function () {
        //pageData.set("isLoading", false);
    }).catch(function (error) {
        alert("ERROR:" + error);
    });
};


/*exports.addDocument = function(){
    home.addToMyDatabase()
        .then(function(){
            console.info("INFO: Documento añadido.")
            dialogsModule.alert("Document added!");
        }).catch(function(error){
            console.error("ERROR: addDocument() ->" + error);
            dialogsModule.alert({
                message: error,
                okButtonText: "OK"
            });
        });
}*/

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

/*exports.getDocument = function(){
    home.getToMyDatabase()
        .then(function(){
            console.info("INFO: Documento recogido.")
            dialogsModule.alert("Document got!");
        }).catch(function(error){
            console.error("ERROR: getDocument() -> " + error);
            dialogsModule.alert({
                message: error,
                okButtonText: "OK"
            });
        });
}*/