var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");
var observableModule = require("tns-core-modules/data/observable");

function UserProfile(info){
    info = info || {};

    // Object
    var viewModel = new observableModule.fromObject({
        email: info.email || "",
        password: info.password || "",
        imagePath: info.imagePath || "",
        isEditableEmail: false,
        isEditablePassword: false
    });

    viewModel.getCurrentUser = function(){
        return firebase.getCurrentUser()
            .then(function(user){
                alert(JSON.stringify(user));
                console.log("User uid: " + user.uid);
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