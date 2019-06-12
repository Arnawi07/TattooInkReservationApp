var Observable = require("tns-core-modules/data/observable").Observable;
var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

function Reservations() {
    // Object
    var viewModel = new Observable();
    viewModel.workersListNames = new ObservableArray([]);
    viewModel.workersListTimeTables = new ObservableArray([]);
    viewModel.reservationsCalendar = new ObservableArray([]);
    viewModel.holidaysCalendar = new ObservableArray([]);
    viewModel.holidaysDay = new ObservableArray([]);
    //Reserve-modal
    viewModel.tattooTypes = new ObservableArray([]);
    viewModel.tattooPrices = new ObservableArray([]);
    viewModel.tattooDurations = new ObservableArray([]);
    viewModel.timeTableShop = "";




    viewModel.emptyArrayWorkersListNames = function () {
        while (viewModel.workersListNames.length) {
            viewModel.workersListNames.pop();
        }

        /*while(viewModel.workersListTimeTables.length){
            viewModel.workersListTimeTables.pop();
        }*/

    }

    viewModel.emptyArrayReservationCalendar = function () {
        while (viewModel.reservationsCalendar.length) {
            viewModel.reservationsCalendar.pop();
        }
        /*
        while (viewModel.holidaysCalendar.length) {
            viewModel.holidaysCalendar.pop();
        }*/
    }

    viewModel.emptyArrayInfoTattoos = function () {
        while (viewModel.tattooPrices.length) {
            viewModel.tattooPrices.pop();
        }
        while (viewModel.tattooDurations.length) {
            viewModel.tattooDurations.pop();
        }
        while (viewModel.tattooTypes.length) {
            viewModel.tattooTypes.pop();
        }
        viewModel.timeTableShop = "";
    }
    
    


    //Reservations-page -------------------------------------------------------------------------------------------
    viewModel.getReservationsListForMonth = function(timeTableWorker, month, year){
        var onQueryEvent = function(result) {
            if (!result.error) {
                const day = result.key;
                if(day.includes(year)){
                    //alert(day); //2019-06-30
                    for (let key in result.value){
                        //alert(key); //-L50HJKIOPO
                        firebase.getValue("/timeTables/" + timeTableWorker + "/" + month + "/" + day + "/" + key)
                            .then(function(reservation){
                                console.log("OBJETO => "+JSON.stringify(reservation));
                                viewModel.reservationsCalendar.push({
                                    endDate: reservation.value.endDate,
                                    startDate: reservation.value.startDate,
                                    uidClient: reservation.value.uidClient,
                                    displayName: reservation.value.displayName
                                });

                                //alert("END DATE => "+ reservation.value.endDate); // 2019-06-30T20:00:00
                                //alert("START DATE => "+ reservation.value.startDate); // 2019-06-30T19:30:00
                                //alert("UIDCLIENT => "+ reservation.value.uidClient); // dKxUY52t0hgNDF10wd0ZPytT59o1
                                //alert("DISPLAY NAME => "+reservation.value.displayName); // Pepe de los palotes
                        });
                    }
                }
            }
        }

        return firebase.query(
            onQueryEvent, "/timeTables/" + timeTableWorker + "/" + month,
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

    viewModel.getHolidays = function () {
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.holidaysCalendar.push({
                    endDate: result.value.endDate,
                    startDate: result.value.startDate
                });
                viewModel.holidaysDay.push(result.key);
            }
        }

        return firebase.query(
            onQueryEvent, "/timeTableShop/holidays",
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

    viewModel.getWorkersList = function () {
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.workersListNames.push(result.value.name + " " + result.value.surname);
                viewModel.workersListTimeTables.push(result.value.nameTimeTable);
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

    viewModel.getReservationsListForDay = function (timeTableWorker, month, date) {
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.reservationsCalendar.push({
                    endDate: result.value.endDate,
                    startDate: result.value.startDate,
                    uidClient: result.value.uidClient,
                    displayName: result.value.displayName
                });

                //alert("END DATE => "+ reservation.value.endDate); // 2019-06-30T20:00:00
                //alert("START DATE => "+ reservation.value.startDate); // 2019-06-30T19:30:00
                //alert("UIDCLIENT => "+ reservation.value.uidClient); // dKxUY52t0hgNDF10wd0ZPytT59o1
                //alert("DISPLAY NAME => "+reservation.value.displayName); // Pepe de los palotes                
            }
        }

        return firebase.query(
            onQueryEvent, "/timeTables/" + timeTableWorker + "/" + month + "/" + date,
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
    //Reserve-modal -------------------------------------------------------------------------------------------------
/*    viewModel.getReservesToday = function (timeTableWorker, month, date) {
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.tattooTypes.push(result.key + " ( " + result.value.minMeasure + "cm - " + result.value.maxMeasure + "cm )");
                viewModel.tattooPrices.push(result.value.approxPrice);
                viewModel.tattooDurations.push(result.value.duration);
            }
        }

        return firebase.query(
            onQueryEvent, "/timeTables/" + timeTableWorker + "/" + month + "/" + date,
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
    }*/

    viewModel.putReserveIntoDay = function (timeTableWorker, month, date, displayName, endDate, startDate, uidClient, emailClient) {
        return firebase.push("/timeTables/" + timeTableWorker + "/" + month + "/" + date, {
            "displayName": displayName,
            "endDate": endDate,
            "startDate": startDate,
            "uidClient": uidClient
            //"email": emailClient
        }
        ).then(function (result) {
            console.log("created key: " + result.key);
        }
        );
    };

    viewModel.getInfoTattoos = function () {
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.tattooTypes.push(result.key + " ( " + result.value.minMeasure + "cm - " + result.value.maxMeasure + "cm )");
                viewModel.tattooPrices.push(result.value.approxPrice);
                viewModel.tattooDurations.push(result.value.duration);
            }
        }

        return firebase.query(
            onQueryEvent, "/tattooType",
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

    viewModel.getTimeTableShop = function (dayWeek) {
        return firebase.getValue("/timeTableShop/scheduleShop/" + dayWeek)
            .then(function (result) {
                viewModel.timeTableShop = result.value.startDate + "h - " + result.value.endDate + "h";
            }).catch(function (error) {
                console.error("ERROR: getAllTattooPhotos() -> " + error);
            });
    };
    
    //Extra --------------------------------------------------------------------------
    viewModel.getCurrentUser = function () {
        return firebase.getCurrentUser()
            .then(function (user) {
                //alert(JSON.stringify(user));
                console.log("User uid: " + user.uid);
                return user;
            });
    }


    return viewModel;
}

module.exports = Reservations;