var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");
var config = require("../config");

function MyReservationsList(items) {
    // Object
    var viewModel = new ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function () {

        var onQueryEvent = function (result) {
            if (!result.error) {
                const worker = result.key;
                for (let month in result.value) {
                    firebase.getValue("/timeTables/" + worker + "/" + month)
                        .then(function (result) {
                            for (let date in result.value) {
                                firebase.getValue("/timeTables/" + worker + "/" + month + "/" + date)
                                    .then(function (result) {
                                        for (let key in result.value) {
                                            var onQueryEvent2 = function (result) {
                                                if (!result.error) {
                                                    console.log("res " + JSON.stringify(result.value));
                                                    console.log(result.value.uidClient + " === " + config.uid);
                                                    if (result.value.uidClient === config.uid) {
                                                        console.log("Estoy dentro");
                                                        viewModel.push({
                                                            keyReservation: key,
                                                            path: "/timeTables/" + worker + "/" + month + "/" + date + "/" + key,
                                                            startDate: result.value.startDate,
                                                            workerShop: worker
                                                        })
                                                    }
                                                }
                                            }

                                            return firebase.query(
                                                onQueryEvent2, "/timeTables/" + worker + "/" + month + "/" + date + "/" + key,
                                                {
                                                    singleEvent: false,
                                    
                                                    orderBy: {
                                                        type: firebase.QueryOrderByType.CHILD,
                                                        value: 'startDate'
                                                    },
                                                    limit: {
                                                        type: firebase.QueryLimitType.LAST,
                                                        value: 'since'
                                                    }
                                                }
                                            );
                                            /*firebase.getValue("/timeTables/" + worker + "/" + month + "/" + date + "/" + key)
                                                .then(function (result) {
                                                    if (result.value.uidClient === config.uid) {
                                                        viewModel.push({
                                                            keyReservation: key,
                                                            path: "/timeTables/" + worker + "/" + month + "/" + date + "/" + key,
                                                            startDate: result.value.startDate,
                                                            workerShop: worker
                                                        })
                                                    }
                                                });*/
                                        }
                                    });
                            }
                        })
                }                
            }
        };

        return firebase.query(
            onQueryEvent, "/timeTables",
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

module.exports = MyReservationsList;