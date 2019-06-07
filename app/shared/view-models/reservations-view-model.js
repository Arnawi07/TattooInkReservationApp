var Observable = require("tns-core-modules/data/observable").Observable;
var observableModule = require("tns-core-modules/data/observable");
var ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

function Reservations(){
    // Object
    var viewModel = new Observable();
    viewModel.workersListNames = new ObservableArray([]);
    viewModel.workersListTimeTables = new ObservableArray([]);
    viewModel.reservationsCalendar = new ObservableArray([]);

    viewModel.emptyArrays = function(){                
        while(viewModel.workersListNames.length){
            viewModel.workersListNames.pop();
        }
        /*while(viewModel.workersListTimeTables.length){
            viewModel.workersListTimeTables.pop();
        }
        while(viewModel.reservationsCalendar.length){
            viewModel.reservationsCalendar.pop();
        }*/
    }

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

   //Comprueba el ano cabron.
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
                                //alert("OBJETO => "+JSON.stringify(reservation));
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

    /**
     *      viewModel.getReservationsListForMonth = function(timeTableWorker, month, date){
            var onQueryEvent = function(result) {
                if (!result.error) {               
                    console.log("res: "+ JSON.stringify(result.value));
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
     */

    viewModel.getCurrentUserUid = function(){
        return firebase.getCurrentUser()
            .then(function(user){
                //alert(JSON.stringify(user));
                console.log("User uid: " + user.uid);
                return user.uid;
            });
    }

    return viewModel;
}

module.exports = Reservations;