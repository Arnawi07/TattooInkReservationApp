var Observable = require("tns-core-modules/data/observable").Observable;
var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

function WorkersList(){
    // Object
    var viewModel = new Observable();
    viewModel.workersListNames = new ObservableArray([]);
    viewModel.workersListTimeTables = new ObservableArray([]);
    viewModel.reservationsCalendar = new ObservableArray([]);

    viewModel.getWorkersList = function(){
        var onQueryEvent = function(result) {
            if (!result.error) {                
                viewModel.workersListNames.push(result.value.name+" "+result.value.surname);
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

   


    viewModel.getReservationsList = function(timeTableWorker, month){
        var onQueryEvent = function(result) {
            if (!result.error) {
                viewModel.get("reservationsList").push({
                    endDate : result.value.endDate,
                    startDate : result.value.startDate,
                    uidClient : result.value.uidClient
                });
            }
        };
    
        return firebase.query(
            onQueryEvent,
            "/timeTables/"+timeTableWorker+"/"+month,
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

    return viewModel;
}

module.exports = WorkersList;