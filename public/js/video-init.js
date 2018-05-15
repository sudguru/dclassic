(function($){
  $(function(){
    $('.tooltipped').tooltip({
      margin: 0,
      position: 'right',
      html: true
    });
    $('select').formSelect();
    $('#modalGift').modal();

    $('#sendGift').on('click', () => {
      var permlink = $('#giftData').data('permlink');
      var author = $('#giftData').data('author');
      var amount = $('#giftAmount').val();
      var currency = $('input[name=giftCurrency]:checked').val();
      var windowHref = '/private/gift/'+author+'/'+amount+'/'+currency+'/'+permlink;
      
      $.ajax({
        type: 'POST',
        url: windowHref,
        dataType: "json",
        success: (res) => {
          if (res.error) {
            M.toast({
              html: 'Not Authorized. Please Login'
            })
          } else {
            console.log('sss')
            window.location.href = windowHref
          }
        },
        error: (err) => {
          console.log(err);
        } 
      });
      
    })
  }); // end of document ready
})(jQuery); // end of jQuery name space