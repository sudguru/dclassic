var instance;
var instance2;
document.addEventListener('DOMContentLoaded', function() {
  var options = {
    dismissible: false,
    startingTop: '0%'
  }
  var elem = document.querySelector('#modalLoading');
  instance = M.Modal.init(elem, options);  

  var options2 = {
    dismissible: true,
    startingTop: '4%'
  }
  var elem2= document.querySelector('#anothermodal');
  instance2 = M.Modal.init(elem2, options2);  
});

var btntest = document.querySelector('#btn-test');
btntest.addEventListener('click', () => {
  instance.open();
})

var btntest2 = document.querySelector('#btn-testtwo');
btntest2.addEventListener('click', () => {
  instance2.open();
})