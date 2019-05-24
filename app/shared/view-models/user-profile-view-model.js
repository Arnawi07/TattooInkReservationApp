var firebase = require("nativescript-plugin-firebase");
var observableModule = require("tns-core-modules/data/observable");

function UserProfile(info){
    info = info || {};

    var viewModel = new observableModule.fromObject({});

    viewModel.changePassword = function(newPassword){
        return firebase.updatePassword(newPassword)
            .then((function () {                                
            }));
    }

    viewModel.changeEmail = function(newEmail){
        return firebase.updateEmail(newEmail)
            .then(function(){
            });
    }

    return viewModel;
}

module.exports = UserProfile;