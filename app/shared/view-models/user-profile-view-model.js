var firebase = require("nativescript-plugin-firebase");

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