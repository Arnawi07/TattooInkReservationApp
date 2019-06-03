var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");

function UserProfile(info){
    info = info || {};

    // Object
    var viewModel = new observableModule.fromObject({
        email: info.email || "",
        password: info.password || "",
        imagePath: info.imagePath || ""
    });

    viewModel.getCurrentUser = function(){
        return firebase.getCurrentUser()
            .then(function(user){
                //alert(JSON.stringify(user));
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

    viewModel.updateProfile = function(imagePath){
        return firebase.updateProfile({
            photoURL: imagePath
            }).then(function () {
            }).catch(function (errorMessage){
                console.log(errorMessage);
            });
    }

    return viewModel;
}

module.exports = UserProfile;