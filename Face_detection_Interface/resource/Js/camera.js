let videoPlaying = false;
function turnOnCamera() {
  const constraints = {
    video: true,
    audio: false,
  };
  videoPlaying = false;
  let v = document.getElementById('v');
  let promise = navigator.mediaDevices.getUserMedia(constraints);

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // 首先，如果有getUserMedia的话，就获得它
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // 否则，为老的navigator.getUserMedia方法包裹一个Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  promise.then(stream => {
    // 旧的浏览器可能没有srcObject
    if ('srcObject' in v) {
      v.srcObject = stream;
    }
    else {
      // 防止再新的浏览器里使用它，应为它已经不再支持了
      v.src = window.URL.createObjectURL(stream);
    }
    v.onloadedmetadata = function(e) {
      v.play();
      videoPlaying = true;
    };
  }).catch(err => {
    console.error(err.name + ': ' + err.message);
  });
}
<!------------------------------------------------------------->
/*
async function run() {
  await faceapi.loadMtcnnModel('/')
  await faceapi.loadFaceRecognitionModel('/')

  const mtcnnResults = await faceapi.mtcnn(document.getElementById('#v'), mtcnnForwardParams)

  const mtcnnForwardParams = {
    // number of scaled versions of the input image passed through the CNN
    // of the first stage, lower numbers will result in lower inference time,
    // but will also be less accurate
    maxNumScales: 10,
    // scale factor used to calculate the scale steps of the image
    // pyramid used in stage 1
    scaleFactor: 0.709,
    // the score threshold values used to filter the bounding
    // boxes of stage 1, 2 and 3
    scoreThresholds: [0.6, 0.7, 0.7],
    // mininum face size to expect, the higher the faster processing will be,
    // but smaller faces won't be detected
    minFaceSize: 200
  };

  faceapi.drawDetection('overlay', mtcnnResults.map(res => res.faceDetection), { withScore: false })
  faceapi.drawLandmarks('overlay', mtcnnResults.map(res => res.faceLandmarks), { lineWidth: 4, color: 'red' })

  const fullFaceDescriptions = await faceapi.allFacesMtcnn(document.getElementById('#v'), mtcnnParams)
}
*/




<!------------------------------------------------------------->
var status=false;
var namecount = 0;
var filename;
var type = 'jpg';
var _fixType = function(type){
  type = type.toLowerCase().replace(/jpg/i,'jpeg');
  var r = type.match(/png|jpeg|bmp|gif/)[0];
  return 'image/' + r;
};

function startTakePhoto(){

  status=true;
  console.log(status);
  console.log("start to Take Photos!");
    setInterval(function() {
      if(videoPlaying) {
        namecount++;
        let canvas = document.getElementById('canvas');
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        canvas.getContext('2d').drawImage(v, 0, 0);
        downloadPhoto();
      }
    },3000);
  }

function downloadPhoto() {

  // filename = new Date().toLocaleTimeString("en-US")+ namecount + '.' + type;
  // var imgData = document.getElementById('canvas').toDataURL(type);
  // imgData = imgData.replace(_fixType(type), 'image/octet-stream');

  // var saveFile = function(data, filename) {
  //   console.log("Downloading Photos!");
  //   var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  //   save_link.href = imgData;
  //   save_link.download = filename;

  //   var event = document.createEvent('MouseEvents');
  //   event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  //   save_link.dispatchEvent(event);
  // };
  console.log(status);
  if(status==="true"){
    console.log(status);
    // saveFile(imgData,filename);
    searchPhoto();
  }else{
    console.log("STOP.")
  }
}

function stopTakePhoto() {
  if(status){
    status=false;
    console.log(status);
  }
}

function callbackdata(data) {

  var URL = "http://13.250.98.176/";
  var id =  data.results[0].user_id;
  var confidence = data.results[0].confidence;
  var length = data.results.length;

  if (length != 0) {

    if (confidence >= 60) {

      // var rawdata = {data: JSON.stringify({"value":'asdf'})};
   
      // $.ajax({
      //   url:URL+"add",
      //   type: 'POST',
      //   data: rawdata,
      //   success: function(msg){
      //               alert(msg);
      //             }
      // });
  

      var datasend = new FormData();
      datasend.append("name",id);

      $.ajax({
        url:URL+"add",
        type:'POST',
        cache:false,
        processData: false,
        contentType: false,
        data:datasend,

        success(data){
        },

        error:function() {
          alert("ERROR");
        }
        
      });

      $.ajax({
        url:URL+"update",
        type:'POST',
        cache:false,
        processData: false,
        contentType: false,
        data:datasend,

        success(data){
        },

        error:function() {
          alert("ERROR");
        }
        
      });

      $.ajax({
        url:URL+"query",
        type:'POST',
        cache:false,
        processData: false,
        contentType: false,
        data:datasend,

        success(data){
          console.log(data);
          if(data === 1&&!counts.includes(id)){
            counts.push(id);
            console.log("!!!");
          }
        },

        error:function() {
          alert("ERROR");
        }
        
      });
      
      
    }
  }
}


var id = [];
var counts=[];
function searchPhoto() {
  
  console.log("Searching photo");
  dataURItoBlob = function(dataURI) { // 图片转成Buffer
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: mimeString});
}


  var data = new FormData();
  var imgFiles = dataURItoBlob(document.getElementById('canvas').toDataURL(type));//.replace(_fixType(type), 'image/octet-stream');
  console.log(typeof imgFiles);
  var url = "https://api-us.faceplusplus.com/facepp/v3/search";
  data.append('api_key',"T7080cfMH824XsoWzR0v4QPc288iTWBu");
  data.append('api_secret',"iWLN8jiciOCMWidOKfzIufBW11I4fjl0");
  data.append('image_file',imgFiles);
  data.append('outer_id',"workingSet");



  $.ajax({
    url:url,
    type:'POST',
    cache:false,
    processData: false,
    contentType: false,
    data:data,

    success(data){
      console.log("Got Face++ Data");

      length = data.results.length;

      if (length != 0) {
        var confidence = data.results[0].confidence;
        if (confidence >= 60) {
          callbackdata(data);
          var newid = data.results[0].user_id;
          console.log(newid);
          var repeat = 0;
          for(var idid of id){
            if(newid === idid){
              repeat++;
            }
          }
          if(repeat===0){
            var p = document.getElementById("attendance-status");
            p.innerHTML = "Number of Students Attended: "+counts.length;
            alertPerson(newid);
            id.push(newid);

          }
        }
        else {
          console.log("Unknown!");
          alertUnknownPerson()}
      }

    },

    error:function() {
      alert("ERROR");
    }
    
  });

}

function alertPerson(alertId) {
  showTips(alertId,500,2);

}

function alertUnknownPerson() {
  var height = 500;
  var time = 1.5;
  var windowWidth  = $(window).width();

  var tipsDiv = '<div class="tipsClass">' + '<div class="row tips-title"> Check In Failed! </div>' +'<div class="row"><img src="resource/photo/fail.png"></div>'+ '</div>';

  $( 'body' ).append( tipsDiv );
  $( 'div.tipsClass' ).css({
    'top'       : height + 'px',
    'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
    'position'  : 'absolute',
    'padding'   : '3px 5px',
    'background': '#E4F1FD',
    'font-size' : 24 + 'px',
    'margin'    : '10px 20px 20px 20px',
    'text-align': 'center',
    'width'     : '350px',
    'height'    : 'auto',
    'color'     : '#fff',
    'opacity'   : '0.9',
    'box-shadow':'0 2px 10px rgba(0, 0, 0, 0.3)'
  }).show();
  $('div.tips-title').css({
    'margin-top':'20px',
    'font-size':'150%',
    'color':'red',
    'font-weight':'700'
  }).show();
  $('img').css({
    'margin':'20px auto 20px',
    'width':'100px',
    'height':'auto',
  }).show();

  setTimeout( function(){$( 'div.tipsClass' ).fadeOut();}, ( time * 1000 ) );

}

//content为要显示的内容
//height为离窗口顶部的距离
//time为多少秒后关闭的时间，单位为秒
function showTips(content, height, time ){
  //窗口的宽度
  var windowWidth  = $(window).width();
  var tipsDiv = '<div class="tipsClass">' + '<div class="row tips-title"> Check In Success! </div>' +'<div class="row"><img src="resource/photo/'+content+'.jpg"></div>'+'<div class="row">'+content+'</div>'+ '</div>';

  $( 'body' ).append( tipsDiv );
  $( 'div.tipsClass' ).css({
    'top'       : height + 'px',
    'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
    'position'  : 'absolute',
    'padding'   : '3px 5px',
    'background': '#E4F1FD',
    'font-size' : 24 + 'px',
    'margin'    : '10px 20px 20px 20px',
    'text-align': 'center',
    'width'     : '350px',
    'height'    : 'auto',
    'color'     : '#555555',
    'opacity'   : '0.9',
    'box-shadow':'0 2px 10px rgba(0, 0, 0, 0.3)'
  }).show();
  $('div.tips-title').css({
    'margin-top':'20px',
    'font-size':'150%',
    'color':'#FBB040',
    'font-weight':'700'
  }).show();
  $('img').css({
    'margin':'20px auto 20px',
    'width':'150px',
    'height':'auto',
    'border-radius':'75px',
    'border':'4px solid #2F7DC0'
  }).show();

  setTimeout( function(){$( 'div.tipsClass' ).fadeOut();}, ( time * 1000 ) );
}