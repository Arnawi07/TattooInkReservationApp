var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");
var config = require("../config");

function TattooShopsList(items){
    // Object
    var viewModel = new ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function() {

      var onChildEvent = function(result) {
        var matches = [];
  
        if (result.type === "ChildAdded") {
          if (result.value.UID === config.uid) {
            //alert("UID user ->"+result.value.UID);
            //alert("KEY Registro ->"+result.key);
            viewModel.push({
              name: result.value.name,
              key: result.key
            });
          }
        } else if (result.type === "ChildRemoved") {
          matches.push(result);
          var index = viewModel.indexOf(result);
          viewModel.splice(index, 1);
          //var index = viewModel.indexOf(result.value.key);
          //alert("index: " + index);
          //viewModel.splice(index, 1);
          /*matches.forEach(function(match) {
            alert("match -> " + JSON.stringify(match));
            var index = viewModel.indexOf(match);
            alert("index: " + index);
           // viewModel.splice(index, 1);
          });*/
        }
  
      };
  
      return firebase.addChildEventListener(onChildEvent, "/tattooShops").then(
        function() {
          console.log("firebase.addChildEventListener added");
        },
        function(error) {
          console.log("firebase.addChildEventListener error: " + error);
        }
      )
    };

    viewModel.addToMyDatabase = function(tattooShop) {
      return firebase.push('/tattooShops',{
        UID: config.uid,  
        name : tattooShop          
      }
      ).then(function (response) {
          //console.log("created key: " + result.key);
          return JSON.stringify(response);
          }
      ).then(function(data){
        //viewModel.push({name: tattooShop, id: data.key});
      });
  }

      viewModel.empty = function(){
          while(viewModel.length){
              viewModel.pop();
          }
      }

      viewModel.delete = function(index) {
        var idObj = viewModel.getItem(index).key;
        return firebase.remove("/tattooShops/"+idObj+"");
      };

      return viewModel;
}

//to get the index of an item to be deleted and handle the deletion on the frontend
function indexOf(item) {
    var match = -1;
    this.forEach(function(loopItem, index) {
      if (loopItem.key === item.key) {//Compara si existe el registro con esa key de registro y te devuleve su posición en el array
        match = index;
      }
    });
    return match;
  }

module.exports = TattooShopsList;