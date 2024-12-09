$(document).ready(function(){
    $('.modal').modal();
  
    // Close modal on submit button click
    $('#submit-button').click(function() {
      $('#modal1').modal('close'); // Replace 'modal-id' with the ID of your modal
    });
  });


  