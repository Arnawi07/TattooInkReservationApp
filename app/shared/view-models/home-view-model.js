var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");

function Home(items){
        let viewModel = new ObservableArray(items);

        viewModel.getToMyDatabase = function() {
            return firebase.getValue("/photosURLHome")
                .then(function(result){
                    for (let key in result.value) {
                        firebase.getValue("/photosURLHome/"+key)
                        .then(function(result){
                            viewModel.push({
                                photoURL : result.value.url,
                                title : result.value.title
                            });
                        }).catch(function(error){
                            alert("ERROR: getToMyDatabase().getValue() -> " + error);
                        });
                    }
                }).catch(function(error){
                    alert("ERROR: getToMyDatabase() -> " + error);
                });
                
        }

        viewModel.empty = function(){
            while(viewModel.length){
                viewModel.pop();
            }
        }

        return viewModel;
}

module.exports = Home;