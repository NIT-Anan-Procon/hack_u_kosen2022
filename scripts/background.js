"use strict";
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.getSelected(null, function (a) {
        var b = a.url;
        b.indexOf("chrome.google.com/webstore") >= 0 ? alert("Please try on any tab OTHER than the CHROME STORE \n SEE YOU NEXT TIME!!") : b.indexOf("chrome://") >= 0 ? alert("Browse to any website and try again! \nWHAT ARE YOU WAITING FOR? DO IT!") : chrome.tabs.executeScript(null, {
            file: "bower_components/jquery/dist/jquery.min.js"
        }, function () {
            chrome.tabs.executeScript(null, {
                file: "scripts/odorec.js"
            }, null)
        })
    })
}), chrome.runtime.setUninstallURL("http://www.googledrive.com/host/0B72pt47BCIyoaERJZDg3RnV3Vlk", function (a) {
    console.log(a)
});
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-67512414-1"]), _gaq.push(["_trackPageview"]), function () {
    var a = document.createElement("script");
    a.type = "text/javascript", a.async = !0, a.src = "https://ssl.google-analytics.com/ga.js";
    var b = document.getElementsByTagName("script")[0];
    b.parentNode.insertBefore(a, b)
}();