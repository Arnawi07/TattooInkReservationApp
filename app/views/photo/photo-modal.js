const observableModule = require("tns-core-modules/data/observable");
let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = observableModule.fromObject(context);
}

exports.onCloseModal = function (args) {
    args.object.closeModal();
}

exports.onNavigatedFrom = function (args) {
    if (args.isBackNavigation === true) {
        args.object.closeModal();
    }
}