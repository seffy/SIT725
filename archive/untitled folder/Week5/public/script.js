import { fetchMessages, addMessage, deleteMessage, updateMessage, renderMessage } from './controller/controller.js';

const socket = io('http://localhost:3000');

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

// Initial fetch
fetchMessages();

$(document).ready(function () {
  $('.modal').modal();

  // Close modal on submit button click
  $('#submit-button').click(function () {
    $('#modal1').modal('close'); // Replace 'modal-id' with the ID of your modal
  });

  $('#modal-close').click(function () {
    $('#modal1').modal('close'); // Replace 'modal-id' with the ID of your modal
  });
});