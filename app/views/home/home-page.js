var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");
var TattooPhotosList = require("../../shared/view-models/home-view-model");
var tattooPhotosList = new TattooPhotosList([]);

var page;
var pageData = new observableModule.fromObject({
  tattooPhotosList: tattooPhotosList,
  isLoading: true
});


exports.loadedHome = function (args) {
  page = args.object;
  //alert("loadedHome");
  //alert(pageData.get("isLoading"));
  if (pageData.get("isLoading")) {
    tattooPhotosList.getAllTattooPhotosOrderBy().then(function () {
      pageData.set("isLoading", false);
    });
  }
  page.bindingContext = pageData;
}

exports.openModal = function (args) {
  const modalViewModule = "views/photo/photo-modal";
  const mainView = args.object;
  const context = { photoUrl: mainView.src, title: mainView.id };
  const fullscreen = true;
  mainView.showModal(modalViewModule, context, function (photoUrl, title) {
  }, fullscreen);
}

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


/*exports.animationCard = function () {
    const card = page.getViewById('jokerCard');
    card
      .animate({
        translate: { x: 0 , y: 100 },
        scale : {x: 1, y: 2},
        duration: 1000
      })
      .then(() => {
        card.visibility = 'collapse';
      });
}*/