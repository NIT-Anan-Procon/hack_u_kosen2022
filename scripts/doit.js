// 'PK' (www.pavel-kaminsky)
// All Rights Reserved.
// Built With ? At 9/8/2015

'use strict';

(function () {
  injectCss();
  addVideo();
})();

//CSSを埋め込んでる
function injectCss() {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('styles/main.css');
  (document.head || document.documentElement).appendChild(style);
}

function addVideo() {
  //reset();

  //1. innerHTMLの兄弟
  var $videoDiv = $.parseHTML('<div class="shia-do-it"><div class="container"><video width="960" height="540" name="media" loop></div></div>');
  $('body').append($videoDiv);

  //2. 1で作ったdivにvideoをぶち込む
  var video = $($videoDiv).find('video').get(0);
  var filename = 'assets/' + 'muscle' + '.mov';
  video.src = chrome.extension.getURL(filename);

  video.onended = function () {
    removeVideo(true);
  };

  video.addEventListener('loadeddata', function () {
    $(video).css('visibility', 'visible');
    video.play();
  }, false);

  //エラー制御
  video.onerror = function () {
    alert('ooops... Shia had a problem. try on another tab');
    removeVideo(false);
  };

  video.load();
}

/*
var BANNER_APPEAR_DELAY = 1000 * 0.5;
var BANNER_REMOVE_AFTER_SEC = 1000 * 8;
var BANNER_APPEAR_PROBABILITY = 0.05;
var BANNER_LOCAL_STORAGE_KEY = 'hasClickedOnBanner';
var LIKEONFB_LOCAL_STORAGE_KEY = 'hasClickedOnBannerLikeOnFB';
*/

/*
function reset() {
  removeVideo(false);
  removeRateMe(false);
}
*/

/*
function removeVideo(showRateMe) {
  var $videoEl = $('.shia-do-it');
  if ($videoEl !== null) {
    $videoEl.remove();

    chrome.storage.sync.get([BANNER_LOCAL_STORAGE_KEY, LIKEONFB_LOCAL_STORAGE_KEY], function (data) {

      var shouldShow = showRateMe;

      //in case we've shown before make use of the probabilty
      if (data[BANNER_LOCAL_STORAGE_KEY] || data[LIKEONFB_LOCAL_STORAGE_KEY]) {
        shouldShow = shouldShow && isShouldShowBanner();
      }

      if (shouldShow) {
        addRateMe();
      }
    });
  }
}
*/

/*
function removeRateMe(isSlow) {
  var speed = isSlow ? 'slow' : 'fast';
  var $rateMeDiv = $('.shia-rate-me-now');
  $rateMeDiv.fadeOut(speed);
}
*/

/*
function isShouldShowBanner() {
  var num = parseInt(Math.random() * 100) + 1;
  var result = num <= BANNER_APPEAR_PROBABILITY * 100;

  return result;
}
*/

/*
function addRateMe() {

  var $rateUsElement = $($.parseHTML('<div class="shia-rate-me-now">' +
    '<a target="_blank" href="http://www.facebook.com/CasuaLOL/">' +
    '<img src="' + chrome.extension.getURL('images/likeonfb.png') + '">' +
    '</a>' +
    '</div>'));

  $rateUsElement.click(function () {
    var saveData = {};
    saveData[LIKEONFB_LOCAL_STORAGE_KEY] = true;

    chrome.storage.sync.set(saveData, function () {
      removeRateMe(false);
    });
  });

  $('body').append($rateUsElement);
  setTimeout(function () {
    $rateUsElement.fadeIn('slow');
  }, BANNER_APPEAR_DELAY);

  setTimeout(function () {
    removeRateMe(true);
  }, BANNER_REMOVE_AFTER_SEC);
}
*/