(function($){
  $(function(){
    $('#btn-choose').on('change', function(event) {
      $(".determinate").css("width", 0);
      const v = document.querySelector('video');
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      const type = file.type;
      const canPlay = v.canPlayType(type);
      v.src = fileURL;
      v.muted = true;
      
      v.play();
      
      $('#btn-captureplay').removeClass('disabled');
      //this.captureready = true;
      //this.toggletext = 'Capture Snap';
      const c1 = document.querySelector('canvas');
      const ctx1 = c1.getContext('2d');

      v.addEventListener('play', function () {
        timerCallback();
      }, false);
    })
    
    function timerCallback() {
      const v = document.querySelector('video');
      if (v.paused || v.ended) {
        return;
      }
      //var ar = v.videoHeight/v.videoWidth;
      var w = v.videoWidth;
      var h = v.videoHeight;
      if(w > 0){
        var nw = 375;
        var nh = 375 * (h/w);
        computeFrame(nw, nh);
      }
      
      setTimeout(function () {
        timerCallback();
      }, 0);
    }

    function computeFrame(w,h) {
      const v = document.querySelector('video');
      const c1 = document.querySelector('canvas');
      const ctx1 = c1.getContext('2d');
      //c1.width = document.getElementById('canvasContainer').clientWidth - 30;
      //console.log(v.videoHeight);
      //c1.height = c1.width * (v.videoHeight/v.videoWidth);
      c1.width = w;
      c1.height = h;
      ctx1.drawImage(v, 0, 0, c1.width, c1.height);
  
      const frame = ctx1.getImageData(0, 0, c1.width, c1.height);
      const l = frame.data.length / 4;
  
      for (let i = 0; i < l; i++) {
        const r = frame.data[i * 4 + 0];
        const g = frame.data[i * 4 + 1];
        const b = frame.data[i * 4 + 2];
        if (g > 100 && r > 100 && b < 43) {
          frame.data[i * 4 + 3] = 0;
        }
      }
      return;
    }

    $('#btn-captureplay').on('click', function() {
      $(".determinate").css("width", 0);
      const v = document.querySelector('video');
      if (v.paused) {
        v.play();
        $(this).html('Capture Snap');
        $('#btn-upload').addClass('disabled');
        $('#btn-snap').addClass('disabled');
      } else {
        v.pause();
        $(this).html('Play');
        //$('#btn-upload').removeClass('disabled');
        $('#btn-snap').removeClass('disabled');
      }
    });

    $('#btn-snap').on('click', function() {
      const v = document.querySelector('video');
      $('#btn-upload').removeClass('disabled');
      $(".determinate").css("width", 0);
      // if (v.paused) {
      //   this.i_progress_mode = 'indeterminate';
      //   const c1 = document.querySelector('canvas');
      //   const image = c1.toDataURL();
      //   const blob = this.dataURItoBlob(image);
      //   this.add_poster_to_ipfs(blob);
      // }
      var formData = new FormData();
      const c1 = document.querySelector('canvas');
      const image = c1.toDataURL('image/jpg');
      const file = dataURItoBlob(image);
      formData.append('myThumb', file);
      var xhr = new XMLHttpRequest();

      // your url upload
      xhr.open('post', '/upload', true);

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          var percentage = (e.loaded / e.total) * 100;
          $(".determinate").css("width", percentage+'%');
        }
      };

      xhr.onerror = function(e) {
        console.log('Error');
        console.log(e);
      };
      xhr.onload = function() {
        localStorage.setItem('myThumb', this.responseText);
        $(".determinate").css("width", 0);
      };

      xhr.send(formData);
    });

    $('#btn-upload').on('click', function(){
      $(".determinate").css("width", 0);
      var formData = new FormData();
      var file = document.getElementById('myFile').files[0];
      formData.append('myFile', file);
      var xhr = new XMLHttpRequest();

      // your url upload
      xhr.open('post', '/upload', true);

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          var percentage = (e.loaded / e.total) * 100;
          $(".determinate").css("width", percentage+'%');
        }
      };

      xhr.onerror = function(e) {
        console.log('Error');
        console.log(e);
      };
      xhr.onload = function() {
        localStorage.setItem('myFile', this.responseText);
      };

      xhr.send(formData);
    });

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);
  
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
  
      return new Blob([ia], {type:mimeString});
    }

    function createSlug(str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();
  
      // remove accents, swap ñ for n, etc
      const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
      const to = 'aaaaeeeeiiiioooouuuunc------';
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }
  
      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
  
      return str;
    }

    function htmlToPlaintext(text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    $('#save-data').on('click', function() {
      var elem = document.querySelector('select');
      var sel = M.FormSelect.getInstance(elem);
      const v = document.querySelector('video');
      var formData = new FormData();
      var title = document.getElementById('title').value;
      var content = document.getElementById('content').value;;
      const temp = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
      var permlink = createSlug(title) + '-' + temp;
      var thumbnail_path = localStorage.getItem('myThumb');
      var video_path = localStorage.getItem('myFile');
      var video_width = v.videoWidth;
      var video_duration = v.duration;
      var tags = sel.getSelectedValues();
      var power_up = 50;
      if ($('#power_up').is(":checked"))
      {
        power_up = 100;
      }


      $.ajax({
          type: 'POST',
          url: '/upload/save',
          data: JSON.stringify({ title, content, permlink, thumbnail_path, video_path, video_width, video_duration, tags, power_up }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: (res) => {
              console.log(res);
              //var batch_id = res.batch_id
              //window.location.href='/payments/history/'+batch_id;
          },
          error: (err) => {
              console.log(err);
          }
      });

     
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space

