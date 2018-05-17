(function($){
  $(function(){

    $('.btn-delete').on('click', function() {

      var id = $(this).data('uid');
      //alert(id);
      $.ajax({
        type: 'DELETE',
        url: '/admin/canupload/'+id,
        dataType: "json",
        success: (res) => {
          //console.log(res.result);
          if (res.error) {
            M.toast({
              html: 'Not Authorized. Please Login'
            })
          } else {
            $('#'+res.result).remove();
            M.toast({
              html: 'Deleted Succesfully'
            })
          }
        },
        error: (err) => {
          console.log(err);
        } 
      });
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space