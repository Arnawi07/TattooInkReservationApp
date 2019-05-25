var observableModule = require("tns-core-modules/data/observable");
var imagepicker = require("nativescript-imagepicker");
var imageSourceModule = require("tns-core-modules/image-source");
var fs = require("tns-core-modules/file-system");
var platformModule = require("tns-core-modules/platform");

var firebase = require("nativescript-plugin-firebase");
var UserProfile = require("../../shared/view-models/user-profile-view-model");
var userProfile = new UserProfile({});

var page;
var currentUser;
var isEditableEmail;
var isEditablePassword;
var imagePath;

exports.loaded = function (args) {
    page = args.object;
    isEditableEmail = userProfile.isEditableEmail;
    isEditablePassword = userProfile.isEditablePassword;
    imagePath = userProfile.imagePath;
    alert(imagePath);
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

exports.editingPhoto = function(){
  var milliseconds = (new Date).getTime;
  var context = imagepicker.create({ mode: "single" }); // use "multiple" for multiple selection
  context
    .authorize()
    .then(function() {
        return context.present();
    })
    .then(function(selection) {
        selection.forEach(function(selected) {
         
            var localPath = null;

            if (platformModule.device.os === "Android") {
                localPath = selected._android;
              
            } else {
                // selected_item.ios for iOS is PHAsset and not path - so we are creating own path
                let folder = fs.knownFolders.documents();
                let path = fs.path.join(folder.path, milliseconds+".png");
                let saved = imagesource.saveToFile(path, "png");

                localPath = path;
                
            }        
            userProfile.set("imagePath", localPath);
        });
        //list.items = selection;
    }).catch(function (error) {
        alert(error)
        console.error("ERROR ImagePicker: -> " + error);
    });
}

function getCurrentUser(){
    userProfile.getCurrentUser()
        .then(function(user){
            userProfile.set("email", user.email);
            userProfile.set("password", "********");
            user.updateProfile({
              photoURL: "/imagePath/pepe"
            });
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