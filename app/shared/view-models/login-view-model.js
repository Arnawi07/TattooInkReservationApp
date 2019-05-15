var observableModule = require("tns-core-modules/data/observable");
var fetchModule = require("tns-core-modules/fetch");
var firebase = require("nativescript-plugin-firebase");
var config = require("../config");

function User(info) {
  info = info || {};

  // Object
  var viewModel = new observableModule.fromObject({
    //username: info.username || "",
    email: info.email || "",
    password: info.password || "",
    isLoggingIn: true,
    showTxtField: true
  });


  /* Functions */
  viewModel.register = function() {
    return firebase.createUser({
        //displayName: viewModel.get("username"),
        email: viewModel.get("email"),
        password: viewModel.get("password"),
        emailVerified: false
      }).then(function (user) {
        alert(JSON.stringify(user));
          console.log(JSON.stringify(user));
          sendEmailVerification();
          return user;          
        });
  }

  viewModel.login = function() {
    return firebase.login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions:{
          email: viewModel.get("email"),
          password: viewModel.get("password")
        }
      }).then(function (user) {
            config.uid = user.uid
            console.log(JSON.stringify(user));
            if(!user.emailVerified){
              console.warn("WARN: Cuenta no verificada.")
              throw new Error("WARN: Cuenta no verificada.");
            }
            return user;
        });
  }

  
  return viewModel;
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

module.exports = User;