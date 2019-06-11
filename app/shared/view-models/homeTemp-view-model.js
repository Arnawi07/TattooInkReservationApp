var observableModule = require("tns-core-modules/data/observable");
var fetchModule = require("tns-core-modules/fetch");
var firebase = require("nativescript-plugin-firebase");

function Home(info) {
    info = info || {};

    // Object
    var viewModel = new observableModule.fromObject({
        name: info.email || "",
        numWorkers: info.password || ""
    });

    /* Functions */

    /* PUSH */
    viewModel.addToMyDatabase = function () {
        return firebase.push('/tattooShops', {
            'name': viewModel.get("name"),
            'numWorkers': viewModel.get("numWorkers")
        }
        ).then(function (result) {
            console.log("created key: " + result.key);
        }
        );
    }


    /* GET */
    viewModel.getToMyDatabase = function () {
        return firebase.get('/tattooShops', {

        }
        ).then(function (result) {
            console.log("created key: " + result.key);
        }
        );
    }

    return viewModel;
}


module.exports = Home;