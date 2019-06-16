var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");
var config = require("../config");

function MyReservationsList(items) {
    // Object
    var viewModel = new ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function () {
        viewModel.empty();  //?¿?¿?¿?¿?¿?¿

        var onQueryEvent = function (result) {
            if (!result.error) {
                const workerTimeTable = result.key;
                const workerName = result.value.name + " " + result.value.surname;
                firebase.getValue("/timeTables/" + workerTimeTable)
                    .then(function(result){
                        for (let month in result.value) {
                            firebase.getValue("/timeTables/" + workerTimeTable + "/" + month)
                                .then(function (result) {
                                    for (let date in result.value) {
                                        firebase.getValue("/timeTables/" + workerTimeTable + "/" + month + "/" + date)
                                            .then(function (result) {
                                                for (let key in result.value) {
                                                    firebase.getValue("/timeTables/" + workerTimeTable + "/" + month + "/" + date + "/" + key)
                                                        .then(function (result) {
                                                            if (result.value.uidClient === config.uid) {
                                                                viewModel.push({
                                                                    keyReservation: key,
                                                                    path: "/timeTables/" + workerTimeTable + "/" + month + "/" + date + "/" + key,
                                                                    startDate: formatDateClient(result.value.startDate),
                                                                    workerShop: workerName
                                                                })
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                })
                        }
                    })                
            }
        };

        return firebase.query(
            onQueryEvent, "/employees",
            {
                singleEvent: false,

                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: 'since'
                },
                limit: {
                    type: firebase.QueryLimitType.LAST,
                    value: 'since'
                }
            }
        );
    };

    viewModel.empty = function () {
        while (viewModel.length) {
            viewModel.pop();
        }
    }

    viewModel.deleteReservation = function (index) {
        var pathObj = viewModel.getItem(index).path;
        viewModel.splice(index, 1);
        return firebase.remove(pathObj);
    };

    return viewModel;
}

function indexOf(item) {
    var match = -1;
    this.forEach(function (loopItem, index) {
        if (loopItem.keyReservation === item.keyReservation) {//Compara si existe el registro con esa key de registro y te devuleve su posición en el array
            match = index;
        }
    });
    return match;
}

function formatDateClient(dateD) {
    const date = new Date(dateD);
    const dayOfStartDateSelected = parseInt(date.getDate()) < 10 ? "0" + parseInt(date.getDate()) : parseInt(date.getDate());
    const monthOfStartDateSelected = parseInt(date.getMonth() + 1) < 10 ? "0" + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
    const hourOfStartDateSelected = parseInt(date.getHours()) < 10 ? "0" + parseInt(date.getHours()) : parseInt(date.getHours());
    const minutesOfStartDateSelected = parseInt(date.getMinutes()) < 10 ? "0" + parseInt(date.getMinutes()) : parseInt(date.getMinutes());
    
    var conector = "";
    if(hourOfStartDateSelected == 13){
      conector = "a la";
    }else{
      conector = "a las";
    }
  
    return String(dayOfStartDateSelected + "-" + monthOfStartDateSelected + "-" + date.getFullYear() + " " + conector + " " + hourOfStartDateSelected + ":" + minutesOfStartDateSelected + "h");
  }

module.exports = MyReservationsList;