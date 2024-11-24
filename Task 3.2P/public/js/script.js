
$(document).ready(function(){

  // Modal Initialization
    $('.modal').modal();

// Adding Buttons to Change Another Button's Color Using jQuery
	$('#button2').click(function() {
        $('#button1x, #button1').css({
          'background-color': 'red',
          'color': 'white'
        });
      });

    $('#button3').click(function() {
        $('#button1x, #button1').css({
          'background-color': 'orange',
          'color': 'white'
        });
      });

    $('#button4').click(function() {
        $('#button1x, #button1').css({
          'background-color': 'green',
          'color': 'white'
        }); 
      });

      $('#vgitbtn').click(function() {
        window.open('https://github.com/seffy/SIT725/tree/main/Task%203.2P', '_blank');
      });
	
  });


