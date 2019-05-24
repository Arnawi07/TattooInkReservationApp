var observableModule = require("tns-core-modules/data/observable");
var UserProfile = require("../../shared/view-models/user-profile-view-model");
var userProfile = new UserProfile({});

var page;
var isEditable;


exports.loaded = function (args) {
    page = args.object;
    isEditable = userProfile.isEditable;
    getCurrentUser();
    page.bindingContext = userProfile;
};

exports.editingProfile = function () {
    isEditable = !isEditable;
    userProfile.set("isEditable", isEditable);
};

function getCurrentUser(){
    userProfile.getCurrentUser()
        .then(function(user){
            userProfile.set("email", user.email);
        }).catch(function(error){
            console.error("ERROR: getCurrentUser() -> " + error);
        })
}

exports.changeEmail = function(){
    userProfile.changeEmail(userProfile.email)
        .then(function(){
            console.info("INFO: Correo electrónico actualizado.")
        }).catch(function(error){
            console.error("ERROR: changeEmail() -> " + error);
        });
}

exports.changePassword = function(){
    userProfile.changePassword(userProfile.password)
        .then(function(){
            console.info("INFO: Contraseña actualizada.");
        }).catch(function(error){
            console.error("ERROR: changePassword() -> " + error);
        });
}