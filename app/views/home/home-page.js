var observableModule = require("tns-core-modules/data/observable");

var HomeViewModel = require("../../shared/view-models/home-view-model");
var home = new HomeViewModel([]);

var pageData = new observableModule.fromObject({
    photosURLList: home
});


function loaded(args) {
    var page = args.object;
    page.bindingContext = pageData;

    home.empty();
    home.getToMyDatabase();
}

exports.animationCard = function (args) {
    const page = args.object;   
    const card = page.getViewById('jokerCard');
    card
      .animate({
        translate: { x: 0 , y: 100 },
        scale : {x: 1, y: 2},
        duration: 1000
      })
      .then(() => {
        //card.visibility = 'collapse';
      });
}

exports.loaded = loaded;