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
        userProfile.set("imagePath",userProfile.imagePath);
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
            alert("error:" + error);
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
        title: "Cambiar Correo Electrónico",
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
                }).catch(function (error) {
                    console.error("ERROR: changeEmail() -> " + error);
                    dialogsModule.alert({
                        title: "Error",
                        message: error,
                        okButtonText: "Aceptar"
                    });
                });


            dialogsModule.alert({
                title: "Verificar Correo Electrónico",
                message: "Debes verificar tu nuevo correo electrónico para poder iniciar sesión de nuevo la próxima vez.",
                okButtonText: "Aceptar"
            });
        }
    });
}


exports.changePassword = function () {
    dialogsModule.prompt({
        title: "Cambiar Contraseña",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputType: dialogsModule.inputType.password
    }).then(function (res) {
        accept = res.result;
        newPassword = res.text;
        if (accept) {
            userProfile.changePassword(newPassword)
                .then(function () {
                    console.info("INFO: Contraseña actualizada.");
                    dialogsModule.alert({
                        title: "Contraseña Actualizada",
                        okButtonText: "Aceptar"
                    });
                }).catch(function (error) {
                    console.error("ERROR: changePassword() -> " + error);
                    dialogsModule.alert({
                        title: "Error",
                        message: error,
                        okButtonText: "Aceptar"
                    });
                });
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

exports.editingPhoto = editingPhoto;