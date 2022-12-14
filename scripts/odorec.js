// 'PK' (www.pavel-kaminsky)
// All Rights Reserved.
// Built With ? At 9/8/2015
var previousVolume = 0;

var imagebox = '<div class="shia-do-it" id="target"><div class="container"><img width="500" name="media"><div class="message" id="message"><p>なんのサイトを見てるのだ？</p></div></div></div>';

var imageresult = 0;
var volumeresult = 0;

'use strict';

(function () {
  setup();
  Test();
  injectCss();
  addVideo();
})();

function setup() {
  var $test = $.parseHTML('<div class="test"><video id="camera" width="1280" height="720"></video><canvas id="canvas" width="1280" height="720"></canvas></div>');
  $('body').append($test);

  let video = document.getElementById("camera");
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: 1280,
        height: 720,
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };
    })
    .catch((error) => {
      console.log(error.name + ": " + error.message);
    });

  // オーディオストリームの生成
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // 音声入力の開始
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      // メディアストリームソースとメーターの生成
      let mediaStreamSource = audioContext.createMediaStreamSource(stream);
      let meter = createAudioMeter(audioContext);
      mediaStreamSource.connect(meter);
    })
  }
}

function Test() {
  const canvas = document.getElementById("canvas");
  let video = document.getElementById("camera");
  setInterval(() => {
    canvas
      .getContext("2d")
      .drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    fetch("http://202.231.44.30:8080/measure-variable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: canvas.toDataURL().replace(/^data:\w+\/\w+;base64,/, ""),
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        imageresult = data["variable"];
        console.log(imageresult);
      });
    //2秒間隔でデータ送信
  }, 700);
}

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
  var $videoDiv = $.parseHTML(imagebox);
  $('body').append($videoDiv);

  //2. 1で作ったdivにvideoをぶち込む
  var video = $($videoDiv).find('img').get(0);
  var filename = 'assets/test.gif';
  video.src = chrome.extension.getURL(filename);

  //3. メッセージをランダム出力
  changeMessageStandard();

  // video.onended = function () {
  //   removeVideo(true);
  // };

  // video.addEventListener('loadeddata', function () {
  //   $(video).css('visibility', 'visible');
  //   video.play();
  // }, false);

  //エラー制御
  video.onerror = function () {
    alert('ooops... Shia had a problem. try on another tab');
    //removeVideo(false);
  };

  //video.load();
}



// メーターの生成
function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  // メーターの生成
  const processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;
  processor.connect(audioContext.destination);

  // クリップチェック時に呼ばれる
  processor.checkClipping = function () {
    if (!this.clipping) {
      return false;
    }
    if ((this.lastClip + this.clipLag) < window.performance.now()) {
      this.clipping = false;
    }
    return this.clipping;
  }

  // シャットダウン時に呼ばれる
  processor.shutdown = function () {
    this.disconnect();
    this.onaudioprocess = null;
  }

  return processor;
}

// オーディオ処理時に呼ばれる
function volumeAudioProcess(event) {
  const buf = event.inputBuffer.getChannelData(0);
  const bufLength = buf.length;
  let sum = 0;
  let x;

  // 平均ボリュームの計算
  for (var i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }
  const rms = Math.sqrt(sum / bufLength);
  //計算には二乗平均平方根(RMS: root mean square）を用いる
  this.volume = Math.max(rms, this.volume * this.averaging);

  // ボリュームの表示
  if (this.volume - previousVolume > 0.05) {
    var tmpVolume = this.volume - previousVolume;
    console.log(tmpVolume);
    //グローバル変数volumeresultに計測値を保存
    volumeresult = tmpVolume;
    //ボリュームの大きさで画像を変える
    changeVideo();
  }
  previousVolume = this.volume;
}

//泣く前事前準備
function changeVideobefore() {

  //今出てる画像を削除する。
  document.getElementById('target').remove();

  //新しい画像をページに追加する
  var $videoDiv = $.parseHTML(imagebox);
  $('body').append($videoDiv);
  var video = $($videoDiv).find('img').get(0);
  var filename = 'assets/test2.gif';
  video.src = chrome.extension.getURL(filename);
}

//ボリュームの大きさで画像を変える
function changeVideo() {
  //泣く前事前準備
  changeVideobefore();

  //テキスト変更
  changeMessage("わあ！！");

  //1秒後に変換
  sleep(2, function () {
    //今出てる画像を削除する。
    document.getElementById('target').remove();
    var $videoDiv = $.parseHTML(imagebox);
    $('body').append($videoDiv);
    var video = $($videoDiv).find('img').get(0);
    var filename;
    var surpriseMessage;

    //オドロキ度を計算
    var judge = calcSurpriseDegree();

    if (judge > 80) {
      filename = 'assets/test4.gif';
      surpriseMessage = "ふぇぇぇ";
    } else if (judge > 50) {
      filename = 'assets/test4.gif';
      surpriseMessage = "うっうっうっ";
    } else if (judge > 30) {
      filename = 'assets/test3.gif';
      surpriseMessage = "びっくりしたのだ";
    } else if (judge > 10) {
      filename = 'assets/test.gif';
      surpriseMessage = "やめるのだ";
      sleep(2, function () {
        changeMessageStandard();
        console.log("初期状態に戻りました");
      });
    } else {
      filename = 'assets/test.gif';
      surpriseMessage = "なにしてるのだ？";
      sleep(2, function () {
        changeMessageStandard();
        console.log("初期状態に戻りました");
      });
    }
    console.log(`使用GIF${filename}`);
    console.log('1秒経過しました！');
    video.src = chrome.extension.getURL(filename);

    changeMessage(surpriseMessage);

    //TO DO
    //changeStyle();
    

  });
}

//****TODO レベルアップできるようにするバーの表示****** */
function changeStyle(number) {
  $width = number + "px";
  console.log("ffffffffffffff" + $width);
  document.getElementById("meter").style.width = $width;
}

function changeMessage(message) {
  document.getElementById("message").textContent = message;
}

function changeMessageStandard() {
  var messagebox = [
    "げんきなのだ？",
    "なに変なサイトみてるのだ？",
    "課題をさっさとおわらせるのだ",
    "親孝行はおこたったらだめなのだ",
    "ぼくにあいさつしろなのだ",
    "つかれたふりするななのだ"
  ];
  var num = Math.floor(Math.random() * 6);
  document.getElementById("message").textContent = messagebox[num];
}

//オドロキ度を計算
function calcSurpriseDegree() {
  var realImageResult = imageresult;
  var realVolumeResult = volumeresult * 300;
  var result = realVolumeResult + realImageResult;
  console.log(`合計点：${result}\n画像処理：${realImageResult}\n音声処理：${realVolumeResult}`);
  return result;
}

function sleep(waitSec, callbackFunc) {
  var spanedSec = 0;
  var waitFunc = function () {
    spanedSec++;
    if (spanedSec >= waitSec) {
      if (callbackFunc) callbackFunc();
      return;
    }
    clearTimeout(id);
    id = setTimeout(waitFunc, 1000);
  };
  var id = setTimeout(waitFunc, 1000);
}