const socket = io('http://localhost:8080');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Real-time updates
socket.on('message-added', (message) => {
  renderMessage(message); // Prepend the new message
});

socket.on('messages-updated', (sortedMessages) => {
  messagesDiv.innerHTML = ''; // Clear the current list

  sortedMessages.forEach(renderMessage); // Render each message in the correct order
});

socket.on('message-deleted', () => {
  fetchMessages(); // Refresh all messages
});

$(document).ready(function(){
  $('.modal').modal();

    // Close modal on submit button click
    $('#submit-button').click(function() {
      $('#modal1').modal('close'); // Replace 'modal-id' with the ID of your modal
    });

  // Close modal on submit button click
  $('#modal-close').click(function() {
    $('#modal1').modal('close'); // Replace 'modal-id' with the ID of your modal
  });


});
