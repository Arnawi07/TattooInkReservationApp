const observableModule = require("tns-core-modules/data/observable");
var timerModule = require("tns-core-modules/timer");

var Contact = require("../../shared/view-models/contact-view-model");
var Contact = new Contact();
var contact = Contact;

var pageData = {
    contact: contact
}

exports.onShownModally = function (args) {
    const page = args.object;
    contact.getInfoTattooShop();

    setTimeout(function () {
        page.bindingContext = pageData;
    }, 400);    
}

exports.onCloseModal = function (args) {
    args.object.closeModal();
}

exports.onNavigatedFrom = function (args) {
    if (args.isBackNavigation === true) {
        args.object.closeModal();
    }
}