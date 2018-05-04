(function($){
    $(function(){
  
      $('.sidenav').sidenav();
      $(".owl-carousel").owlCarousel({
        margin: 5,
        items: 5,
        loop: true,
        nav: true,
        navText:[
          '<a class="btn-floating waves-effect waves-light white"><i class="material-icons grey-text text-darken-4">keyboard_arrow_left</i></a>',
          '<a class="btn-floating btn waves-effect waves-light white"><i class="material-icons grey-text text-darken-4">keyboard_arrow_right</i></a>'
        ],
        dots: false,
        responsive : {
          0 : {
            items: 1,
          },
          480 : {
            items: 2,
          },
          768 : {
            items: 3,
          },
          980 : {
            items: 4,
          },
          1200 : {
            items: 5,
          }

      }
      });

    }); // end of document ready
  })(jQuery); // end of jQuery name space