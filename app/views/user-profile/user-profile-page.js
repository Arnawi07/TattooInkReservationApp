var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");
var UserProfile = require("../../shared/view-models/user-profile-view-model");
var userProfile = new UserProfile({});

var page;
var isEditableEmail;
var isEditablePassword;

exports.loaded = function (args) {
    page = args.object;
    isEditableEmail = userProfile.isEditableEmail;
    isEditablePassword = userProfile.isEditablePassword;
    getCurrentUser();
    page.bindingContext = userProfile;
};

function editingPassword() { 
    isEditablePassword = !isEditablePassword;

    if(isEditablePassword){
      oldPasswd = page.getViewById("passwordXML").text;
      page.getViewById("passwordXML").text = "";
    }else{
      page.getViewById("passwordXML").text = oldPasswd;
    }

    userProfile.set("isEditablePassword", isEditablePassword);
};

function editingEmail() {
    isEditableEmail = !isEditableEmail;

    if(isEditableEmail){
      oldEmail =  page.getViewById("emailXML").text;
      page.getViewById("emailXML").text = "";
    }else{
      page.getViewById("emailXML").text = oldEmail;
    }
    userProfile.set("isEditableEmail", isEditableEmail);
};

function getCurrentUser(){
    userProfile.getCurrentUser()
        .then(function(user){
            userProfile.set("email", user.email);
            userProfile.set("password", "********");
        }).catch(function(error){
            console.error("ERROR: getCurrentUser() -> " + error);
        });
}

function signOut(args) {
  firebase.logout()
      .then(function() {
          console.info("INFO: Sesión cerrada.");
          const button = args.object;
          const page = button.page;
          const myFrame = page.frame;
          const navigationEntry = {
              moduleName: "views/login/login-page",
              clearHistory: true //Este atributo es super importante, ya que sin él, el historial no se limpia y cuando cierres sesion y tires hacia atras te volvera a la aplicacion sin tener que iniciar sesion
          };
          myFrame.navigate(navigationEntry);    
      }, function(error) {
          console.error("ERROR: signOut() -> " + error);
    });
}

function sendEmailVerification(){
  firebase.sendEmailVerification().then(
    function () {
      console.info("INFO: Correo de verificación de cuenta enviado.");
    },
    function (error) {
      console.error("ERROR: sendEmailVerification() -> " + error);
    }
  );
}

exports.changeEmail = function(args){
    userProfile.changeEmail(userProfile.email)
        .then(function(){
            console.info("INFO: Correo electrónico actualizado.");
            sendEmailVerification();
        }).catch(function(error){
            console.error("ERROR: changeEmail() -> " + error);
        });
     signOut(args);
     alert("Verifica tu nueva cuenta "+userProfile.email+" para iniciar sesión de nuevo.");
}

exports.changePassword = function(){
    userProfile.changePassword(userProfile.password)
        .then(function(){
            console.info("INFO: Contraseña actualizada.");
        }).catch(function(error){
            console.error("ERROR: changePassword() -> " + error);
        });
    editingPassword();
}

exports.editingEmail = editingEmail;
exports.editingPassword = editingPassword;