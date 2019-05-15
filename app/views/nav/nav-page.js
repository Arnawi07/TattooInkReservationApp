const observableModule = require("tns-core-modules/data/observable");
const dialogs = require("tns-core-modules/ui/dialogs");
var vm = new observableModule.Observable();

exports.onLoaded = function (args) {
    const tabView = args.object;
    vm.set("tabSelectedIndex", 0);
    //vm.set("tabSelectedIndexResult", "Profile Tab (tabSelectedIndex = 0 )");

    tabView.bindingContext = vm;
}

/*function changeTab(args) {
    const tabSelectedIndex = vm.get("tabSelectedIndex");
    if (tabSelectedIndex === 0) {
        vm.set("tabSelectedIndex", 1);
    } else if (tabSelectedIndex === 1) {
        vm.set("tabSelectedIndex", 2);
    } else if (tabSelectedIndex === 2) {
        vm.set("tabSelectedIndex", 0);
    }
}*/

// displaying the old and new TabView selectedIndex
exports.onSelectedIndexChanged = function (args) {
    /*if (args.oldIndex !== -1) {
        const newIndex = args.newIndex;
        if (newIndex === 0) {
            vm.set("tabSelectedIndexResult", "Profile Tab (tabSelectedIndex = 0 )");
        } else if (newIndex === 1) {
            vm.set("tabSelectedIndexResult", "Stats Tab (tabSelectedIndex = 1 )");
        } else if (newIndex === 2) {
            vm.set("tabSelectedIndexResult", "Settings Tab (tabSelectedIndex = 2 )");
        }
        /*dialogs.alert(`Selected index has changed ( Old index: ${args.oldIndex} New index: ${args.newIndex} )`)
            .then(() => {
                console.log("Dialog closed!");
            });*/
    //}
}
// << tab-view-navigation-code