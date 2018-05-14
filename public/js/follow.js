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
            $('#follower').html(parseInt(follower_count)+1);
            $('#votecount').html(parseInt(votes)+1);
        },
        error: (err) => {

            if(err.statusText == "Unauthorized") {
              M.toast({html: 'Not Authorized. Please Login'})
            }
        }
      });
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space