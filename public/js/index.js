(function($){
    $(function(){
      $('.tooltipped').tooltip();

      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      var msg = getParameterByName('msg');
      if(msg && msg == 1) {
        M.toast({
          html: 'Sorry You are not Authorized.'
        })
      }
    }); // end of document ready
  })(jQuery); // end of jQuery name space