var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

function TattooPhotosList(items){
    let viewModel = new ObservableArray(items);

    viewModel.empty = function(){
        while(viewModel.length){
            viewModel.pop();
        }
    }

    viewModel.getAllTattooPhotos = function() {
        return firebase.getValue("/photosURLHome")
            .then(function(result){
                for (let key in result.value) {
                    firebase.getValue("/photosURLHome/"+key)
                        .then(function(result){
                            viewModel.push({
                                photoUrl : result.value.url,
                                title : result.value.title
                            });
                        }).catch(function(error){
                            console.error("ERROR: getAllTattooPhotos().getValue() -> " + error);
                        });
                }
            }).catch(function(error){
                console.error("ERROR: getAllTattooPhotos() -> " + error);
            });
            
    }

    return viewModel;
}

module.exports = TattooPhotosList;