var dialogsModule = require("tns-core-modules/ui/dialogs");
var UserViewModel = require("../../shared/view-models/login-view-model");
var user = new UserViewModel({});

var page;


exports.onLoaded = function (args) {
    page = args.object;
    isLoggingIn = user.isLoggingIn;
    showTxtField = user.showTxtField;
    page.bindingContext = user;
};

exports.toggleDisplay = function () {
    isLoggingIn = !isLoggingIn;
    showTxtField = !showTxtField;

    //Vacia los campos cuando cambia a registro/inicio sesión    
    page.getViewById("displayNameXML").text = "";
    page.getViewById("emailXML").text = "";
    page.getViewById("passwordXML").text = "";
    page.getViewById("passwordConfirmationXML").text = "";
    page.getViewById("checkTerms").checked = false;

    user.set("isLoggingIn", isLoggingIn);
    user.set("showTxtField", showTxtField);
};

exports.submit = function (args) {
    if (isLoggingIn) {
        login(args);
    } else {
        if (validationNewUser()) {
            signUp();
        }
    }
};

exports.resetPassword = function () {
    dialogsModule.prompt({
        title: "Recuperación de Contraseña",
        message: "Introduce el correo electrónico asociado a la cuenta. Te enviaremos un correo de recuperación de contraseña.",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        inputType: dialogsModule.inputType.email
    }).then(function (res) {
            accept = res.result;
            emailRecuperation = res.text.trim();
            if (accept) {
                user.resetPassword(emailRecuperation)
                    .then(function () {
                        console.info("INFO: Correo de recuperación de contraseña enviado.");            
                    }).catch(function (error) {
                        console.error("ERROR: resetPassword() -> " + error);
                    });
            }
        });    
}

exports.openModalTermsAndConditions = function (args) {
    const modalViewModule = "views/terms/terms-modal";
    const mainView = args.object;
    const context = {};
    const fullscreen = true;
    mainView.showModal(modalViewModule, context, function () {
    }, fullscreen);
}


function login(args) {
    user.login()
        .then(function () {
            console.info("INFO: Usuario logueado.");
            const button = args.object;
            const page = button.page;
            const myFrame = page.frame;
            const navigationEntry = {
                moduleName: "views/nav/nav-page",
                clearHistory: true //En este caso el clearHistory lo hacemos para que cuando el usuario este en el home y tire hacia atras se vaya fuera de la aplicación, y no a la pantalla login.
            };
            myFrame.navigate(navigationEntry);
        })
        .catch(function (error) {
            console.error("ERROR: login() -> " + error);
            dialogsModule.alert({
                message: "Desafortunadamente no encontramos tu cuenta." + error,
                okButtonText: "OK"
            });
        });
}

function signUp() {
    user.register()
        .then(function () {
            console.info("INFO: Usuario registrado.");
            dialogsModule.alert({
                message: "Tu cuenta ha sido creada correctamente. Te hemos enviado un correo de verificación de cuenta.",
                okButtonText: "Vale"
            });
            //frameModule.topmost().navigate("views/login/login-page");
        }).catch(function (error) {
            console.error("ERROR: signUp() -> " + error);
        });
}

function validationNewUser(){
    const passwd = page.getViewById("passwordXML").text;
    const passwdConfirmation = page.getViewById("passwordConfirmationXML").text;
    const checkBoxChecked = page.getViewById("checkTerms").checked;

    if(passwd !== passwdConfirmation){
        console.warn("WARN: validationNewUser() -> Contraseña de confirmación diferente");
        dialogsModule.alert({
            message:"La contraseña de confirmación no coincide.",
            okButtonText:"Vale"
        });
    } else if(!checkBoxChecked){
        console.warn("WARN: validationNewUser() -> No checked acceptTerms");
        dialogsModule.alert({
            message: "Porfavor lee y acepta los términos y condiciones de uso.",
            okButtonText: "Vale"
        });
    } else{
        console.info("INFO: validaciones correctas");
        return true;
    }
    return false;
}