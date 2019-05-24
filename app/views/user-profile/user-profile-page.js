var observableModule = require("tns-core-modules/data/observable");
var page;
var bool;
var data = new observableModule.fromObject({
    isEditing : false
  });



exports.loaded = function (args) {
    page = args.object;
    bool = data.isEditing;
    page.bindingContext = data;
};

exports.editingProfile = function () {
   bool = !bool;
   data.set("isEditing", bool); 
};