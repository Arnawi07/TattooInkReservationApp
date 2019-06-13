var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");

var HomeViewModel = require("../../shared/view-models/homeTemp-view-model");
var TattooShopsListViewModel = require("../../shared/view-models/tattoo-shops-list-view-model");
var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var home = new HomeViewModel({});
var tattooShopsList = new TattooShopsListViewModel([]);

var page;
var pageData = new observableModule.fromObject({
    tattooShopsList: tattooShopsList,
    tattooShop: "",
    isLoading: false
});

exports.loaded = function (args) {
    page = args.object;
    page.bindingContext = pageData;
    //page.bindingContext = home;

    tattooShopsList.empty();
    pageData.set("isLoading", true);
    tattooShopsList.load().then(function () {
        pageData.set("isLoading", false);
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

exports.add = function () {
    // Check for empty submissions
    if (pageData.get("tattooShop").trim() === "") {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
        return;
    }

    // Dismiss the keyboard
    page.getViewById("tattooShopXML").dismissSoftInput();
    tattooShopsList.addToMyDatabase(pageData.get("tattooShop"))
        .catch(function (error) {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list." + error,
                okButtonText: "OK"
            });
        });

    // Empty the input field
    pageData.set("tattooShop", "");
};

exports.delete = function (args) {
    var item = args.view.bindingContext;

    var index = tattooShopsList.indexOf(item);
    tattooShopsList.delete(index);
};

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