var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");
var config = require("../config");

function User(info) {
  info = info || {};

  // Object
  var viewModel = new observableModule.fromObject({
    displayName: info.displayName || "",
    /*email: info.email || "",
    password: info.password || "",*/
    email: "juanpe@gmail.com" || "",
    password: "juanpe123" || "",
    isLoggingIn: true,
    showTxtField: true
  });


  /* Functions */
  viewModel.register = function () {
    return firebase.createUser({
      email: viewModel.get("email"),
      password: viewModel.get("password"),
      emailVerified: false
    }).then(function (user) {
      firebase.updateProfile({
        displayName: viewModel.get("displayName")
      });
      console.log(JSON.stringify(user));
      sendEmailVerification();
      return user;
    });
  }

  viewModel.login = function () {
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: viewModel.get("email"),
        password: viewModel.get("password")
      }
    }).then(function (user) {
      config.uid = user.uid
      console.log(JSON.stringify(user));
      /*if (!user.emailVerified) {
        console.warn("WARN: Cuenta no verificada.")
        throw new Error("WARN: Cuenta no verificada.");
      }*/
      return user;
    });
  }


  viewModel.resetPassword = function (email) {
    return firebase.sendPasswordResetEmail(email)
      .then(function () {
      });
  }


  return viewModel;
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

module.exports = User;