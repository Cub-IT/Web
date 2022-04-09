$(function(){
    const url = new URLSearchParams(window.location.search);
    var id = url.get('name');
  
    // LOADER HIDE
    $('.loader-wrapper').fadeOut('slow');
})