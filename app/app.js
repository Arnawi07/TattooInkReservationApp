/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

const application = require("tns-core-modules/application");
var firebase = require("nativescript-plugin-firebase");
var config = require("../app/shared/config");

firebase.init({
  url: config.apiUrl
}).then(
    function (instance) {
      console.info("INFO: Firebase inicializado.");
    },
    function (error) {
      console.error("ERROR: firebase.init -> " + error);
    }
);

application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
