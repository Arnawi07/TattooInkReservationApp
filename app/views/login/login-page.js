var dialogsModule = require("tns-core-modules/ui/dialogs");
var frameModule = require("tns-core-modules/ui/frame");

var UserViewModel = require("../../shared/view-models/login-view-model");
var user = new UserViewModel({});

var page;


exports.loaded = function (args) {
    page = args.object;
    page.actionBarHidden = true;
    isLoggingIn = user.isLoggingIn;
    showTxtField = user.showTxtField;
    page.bindingContext = user;
};

exports.toggleDisplay = function () {
    isLoggingIn = !isLoggingIn;
    showTxtField = !showTxtField;
    
    //Vacia los campos cuando cambia a registro/inicio sesión    
    //page.getViewById("usernameXML").text = "" 
    page.getViewById("emailXML").text = ""
    page.getViewById("passwordXML").text = ""
    page.getViewById("passwordConfirmationXML").text = ""
    
    user.set("isLoggingIn", isLoggingIn);
    user.set("showTxtField", showTxtField);
};

exports.submit = function () {
    if (isLoggingIn) {
        login();
    } else {
        if (page.getViewById("passwordXML").text == page.getViewById("passwordConfirmationXML").text){
           signUp();
        } else{
            dialogsModule.alert("La contraseña de confirmación es diferente.");
        }
    }
};

function login() {
    user.login()
        .then(function () {
            console.info("INFO: Usuario logueado.");
            frameModule.topmost().navigate("views/nav/nav-page");
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
        .then(function() {
            console.info("INFO: Usuario registrado.");
            dialogsModule.alert("Tu cuenta ha sido creada correctamente.");
            //frameModule.topmost().navigate("views/login/login-page");
        }).catch(function(error) {
            console.error("ERROR: signUp() -> " + error);
            dialogsModule.alert({
                message: error,
                okButtonText: "OK"
            });
        });
}