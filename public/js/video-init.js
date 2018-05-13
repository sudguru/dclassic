(function($){
  $(function(){
    $('.dropdown-trigger').dropdown({
        hover: true,
        alignment: 'bottom'
    });

    $('.upvote').on('click', function() {

      var username = $(this).data('user');
      var author = $(this).data('author');
      var permlink = $(this).data('permlink');
      var votes = $(this).data('votes');
      $.ajax({
        type: 'POST',
        url: '/private/upvote/'+username+'/'+author+'/'+permlink,
        dataType: "json",
        success: (res) => {
            console.log('hello');
            $('#votecount').html(parseInt(votes)+1);
        },
        error: (err) => {
            console.log(err);
        }
    });
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space