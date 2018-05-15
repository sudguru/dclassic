(function($){
  $(function(){

    $('#follow').on('click', function() {

      var username = $(this).data('user');
      var author = $(this).data('author');
      var follower_count = $(this).data('follower');
      $.ajax({
        type: 'POST',
        url: '/private/follow/'+username+'/'+author,
        dataType: "json",
        success: (res) => {
          console.log(res);
          if (res.error) {
            M.toast({
              html: 'Not Authorized. Please Login'
            })
          } else {
            $('#follower').html(parseInt(follower_count)+1);
          }
        },
        error: (err) => {
          console.log(err);
        } 
      });
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space