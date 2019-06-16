var observableModule = require("tns-core-modules/data/observable");
var firebase = require("nativescript-plugin-firebase");

function Contact() {
    // Object
    var viewModel = new observableModule.fromObject({
        nameShop: "",
        telephoneShop: "",
        emailShop: "",
        addressShop: ""
    });

    viewModel.getInfoTattooShop = function(){
        var onQueryEvent = function (result) {
            if (!result.error) {
                viewModel.nameShop = result.value.name;
                viewModel.telephoneShop = result.value.phone;
                viewModel.emailShop = result.value.email;
                viewModel.addressShop = result.value.address;
            }
        };

        return firebase.query(
            onQueryEvent,
            "/tattooShops",
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
    }

    return viewModel;
}

module.exports = Contact;