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
    //Reserve-modal
    viewModel.tattooTypes = new ObservableArray([]);
    viewModel.tattooPrices = new ObservableArray([]);
    viewModel.tattooDurations = new ObservableArray([]);
    viewModel.timeTableShop = "";


    viewModel.emptyArrayWorkersListNames = function(){                
        while(viewModel.workersListNames.length){
            viewModel.workersListNames.pop();
        }
        /*while(viewModel.workersListTimeTables.length){
            viewModel.workersListTimeTables.pop();
        }*/
       
    }

    viewModel.emptyArrayReservationsCalendar = function(){                
        while(viewModel.reservationsCalendar.length){
            viewModel.reservationsCalendar.pop();
        }
    }

    viewModel.emptyArrayInfoTattoos = function(){                
        while(viewModel.tattooPrices.length){
            viewModel.tattooPrices.pop();
        }
        while(viewModel.tattooDurations.length){
            viewModel.tattooDurations.pop();
        }
        while(viewModel.tattooTypes.length){
            viewModel.tattooTypes.pop();
        }
        viewModel.timeTableShop = "";
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
    
    viewModel.getReservationsListForDay = function(timeTableWorker, month, date){
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

    viewModel.getInfoTattoos = function(){
        var onQueryEvent = function(result) {
            if (!result.error) {               
                viewModel.tattooTypes.push(result.key+" ( "+result.value.minMeasure+"cm - "+result.value.maxMeasure+"cm )");
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

    viewModel.getTimeTableShop = function(dayWeek){
        return firebase.getValue("/timeTableShop/scheduleShop/"+dayWeek)
            .then(function(result){
                viewModel.timeTableShop = result.value.startDate+"-"+result.value.endDate;
            }).catch(function(error){
                console.error("ERROR: getAllTattooPhotos() -> " + error);
            });       
    }; 
    
    

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

/*
  
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
*/