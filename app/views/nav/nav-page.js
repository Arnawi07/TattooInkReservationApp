const observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase")

var page;
var pageData = new observableModule.fromObject({});

exports.onLoaded = function (args) {
    page = args.object;
    pageData.set("tabSelectedIndex", 0);

    page.bindingContext = pageData;
}

function signOut(args) {
    firebase.logout().then(function() {
        const button = args.object;
        const page = button.page;
        page.frame.navigate("views/login/login-page");
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
}

exports.signOut = signOut;

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
/*exports.onSelectedIndexChanged = function (args) {
    if (args.oldIndex !== -1) {
        const newIndex = args.newIndex;
        if (newIndex === 0) {
            vm.set("tabSelectedIndexResult", "Profile Tab (tabSelectedIndex = 0 )");
        } else if (newIndex === 1) {
            vm.set("tabSelectedIndexResult", "Stats Tab (tabSelectedIndex = 1 )");
        } else if (newIndex === 2) {
            vm.set("tabSelectedIndexResult", "Settings Tab (tabSelectedIndex = 2 )");
        }
        dialogs.alert(`Selected index has changed ( Old index: ${args.oldIndex} New index: ${args.newIndex} )`)
            .then(() => {
                console.log("Dialog closed!");
            });
    }
}*/