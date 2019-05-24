var observableModule = require("tns-core-modules/data/observable");
var UserProfile = require("../../shared/view-models/user-profile-view-model");
var userProfile = new UserProfile({});

var page;
var isEditable;


exports.loaded = function (args) {
    page = args.object;
    isEditable = userProfile.isEditable;
    page.bindingContext = userProfile;
};

exports.editingProfile = function () {
    isEditable = !isEditable;
    userProfile.set("isEditable", isEditable);
};

exports.changePassword = function(newPassword){
    userProfile.changePassword(newPassword)
        .then(function(){
            console.info("INFO: Contraseña actualizada.");
        }).catch(function(error){
            console.error("ERROR: changePassword() -> " + error);
        });
}

exports.changeEmail = function(newEmail){
    userProfile.changeEmail(newEmail)
        .then(function(){
            console.info("INFO: Correo electrónico actualizado.")
        }).catch(function(error){
            console.error("ERROR: changeEmail() -> " + error);
        });
}