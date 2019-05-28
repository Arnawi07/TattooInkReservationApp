function loaded(args) {
    var page = args.object;
    page.bindingContext = page;
    /*if (platform_1.isAndroid && platform_1.device.sdkVersion >= '21') {
        var window_1 = application_1.android.startActivity.getWindow();
        window_1.setStatusBarColor(new color_1.Color('#004c40').android);
    }*/
}
exports.loaded = loaded;