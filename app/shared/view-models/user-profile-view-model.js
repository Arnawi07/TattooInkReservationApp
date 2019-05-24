var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");
var observableModule = require("tns-core-modules/data/observable");

function UserProfile(info){
    info = info || {};

    // Object
    var viewModel = new observableModule.fromObject({
        email,
        password,
        isEditable: false
    });

    viewModel.getCurrentUser = function(){
        return firebase.getCurrentUser()
            .then(function(user){
                console.log("User uid: " + user.uid);
                alert(JSON.stringify(user));
                return user;
            });
    }

    viewModel.changePassword = function(newPassword){
        return firebase.updatePassword(newPassword)
            .then(function () {                                
            });
    }

    viewModel.changeEmail = function(newEmail){
        return firebase.updateEmail(newEmail)
            .then(function(){
            });
    }

    return viewModel;
}

module.exports = UserProfile;