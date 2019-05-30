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
        return firebase.getValue("/photosUrlHome")
            .then(function(result){
                for (let key in result.value) {
                    firebase.getValue("/photosUrlHome/"+key)
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

    viewModel.getAllTattooPhotosOrderBy = function(){
        var onQueryEvent = function(result) {
            if (!result.error) {
                viewModel.unshift({
                    photoUrl : result.value.url,
                    title : result.value.title
                });
            }
        };
    
        return firebase.query(
            onQueryEvent,
            "/photosUrlHome",
            {
                singleEvent: false,
                
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'creationDate' 
                },
                limit: {
                    type: firebase.QueryLimitType.LAST,
                    value: 'since'
                }
            }
        );

    };
    
    return viewModel;
}

module.exports = TattooPhotosList;