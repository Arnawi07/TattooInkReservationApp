var observableModule = require("tns-core-modules/data/observable");
var imagepicker = require("nativescript-imagepicker");
var imageSourceModule = require("tns-core-modules/image-source");
var fs = require("tns-core-modules/file-system");
var platformModule = require("tns-core-modules/platform");
var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");

var firebase = require("nativescript-plugin-firebase");
var UserProfile = require("../../shared/view-models/user-profile-view-model");
var userProfile = new UserProfile({});

var page;
var currentUser;
var imagePath;

exports.onLoaded = function (args) {
    page = args.object;
    setPhotoUrlUser();
    setTimeout(function(){
        if(userProfile.imagePath == null){
            userProfile.set("imagePath", "~/resources/img/userProfileIcon.png");    
        }else{
            userProfile.set("imagePath", userProfile.imagePath);
        }
    },400);
    page.bindingContext = userProfile;
};

function editingPhoto() {
    var milliseconds = (new Date).getTime;
    var context = imagepicker.create({ mode: "single" }); // use "multiple" for multiple selection
    context
        .authorize()
        .then(function () {
            return context.present();
        })
        .then(function (selection) {
            selection.forEach(function (selected) {
                var localPath = null;

                if (platformModule.device.os === "Android") {
                    localPath = selected._android;
                } else {
                    //selected_item.ios for iOS is PHAsset and not path - so we are creating own path
                    let folder = fs.knownFolders.documents();
                    let path = fs.path.join(folder.path, milliseconds + ".png");
                    let saved = imagesource.saveToFile(path, "png");
                    localPath = path;
                }

                setTimeout(function () {
                    userProfile.set("imagePath", localPath);
                    userProfile.updateProfile(localPath)
                        .then(function () {
                            console.info("INFO: Usuario modificado correctamente.");
                        }).catch(function (error) {
                            console.error("ERROR: updateProfile() -> " + error);
                        });
                }, 300);
            });
        }).catch(function (error) {
            console.error("ERROR ImagePicker: -> " + error);
        });
};

function setPhotoUrlUser() {
    userProfile.getCurrentUser()
        .then(function (user) {
            userProfile.set("email", user.email);
            userProfile.set("password", "********");
            userProfile.set("imagePath", user.photoURL);
            firebase.updateProfile({
                photoURL: user.photoURL
            });
        }).catch(function (error) {
            console.error("ERROR: setPhotoUrlUser() -> " + error);
        });
}

exports.changeEmail = function (args) {
    dialogsModule.prompt({
        title: "Cambio correo electrónico",
        message: "Introduce el nuevo correo electrónico:",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputType: dialogsModule.inputType.email
    }).then(function (res) {
        accept = res.result;
        newEmail = res.text.trim();
        if (accept) {
            userProfile.set("email", newEmail);
            userProfile.changeEmail(newEmail)
                .then(function () {
                    console.info("INFO: Correo electrónico actualizado.");
                    sendEmailVerification();
                    dialogsModule.alert({
                        title: "Verificar correo electrónico",
                        message: "Debes verificar tu nuevo correo electrónico para poder iniciar sesión de nuevo la próxima vez.",
                        okButtonText: "Vale"
                    });
                }).catch(function (error) {
                    console.error("ERROR: changeEmail() -> " + error);
                    dialogsModule.alert({
                        title: "Correo electrónico incorrecto",
                        message: "El formato de correo electrónico es incorrecto.",
                        okButtonText: "Vale"
                    });
                });            
        }
    });
}


exports.changePassword = function () {
    dialogsModule.prompt({
        title: "Cambio contraseña",
        message: "Introduce la nueva contraseña:",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputType: dialogsModule.inputType.password
    }).then(function (res) {
        accept = res.result;
        newPassword = res.text;
        if (accept) {
            if(!validationPassword(newPassword)){
                userProfile.changePassword(newPassword)
                    .then(function () {
                        console.info("INFO: Contraseña actualizada.");
                        dialogsModule.alert({
                            title: "Contraseña actualizada",
                            message: "Se ha actualizado correctamente la contraseña.",
                            okButtonText: "Vale"
                        });
                    }).catch(function (error) {
                        console.error("ERROR: changePassword() -> " + error);
                    });
            }else{
                dialogsModule.alert({
                    title: "Nueva contraseña incorrecta",
                    message: "La nueva contraseña esta vacía o tiene una longitud inferior a 6 caracteres.", 
                    okButtonText: "Vale"
                });
            }
        }
    });
}

function sendEmailVerification() {
    firebase.sendEmailVerification().then(
        function () {
            console.info("INFO: Correo de verificación de cuenta enviado.");
        },
        function (error) {
            console.error("ERROR: sendEmailVerification() -> " + error);
        }
    );
}

function validationPassword(passwdValidation) {
    return (!passwdValidation || 0 === passwdValidation.length || 6>passwdValidation.length);
}

exports.editingPhoto = editingPhoto;