// script.js
import { fetchMessages, addMessage, deleteMessage, updateMessage } from './controller.js';

const socket = io('http://localhost:3000');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');



// controller.js

// Fetch all messages
export async function fetchMessages() {
  const res = await fetch('/messages');
  return await res.json(); // Return the list of messages
}

// Add a new message
export async function addMessage(text) {
  if (!text) throw new Error('Please enter a message');
  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
}

// Delete a message
export async function deleteMessage(id) {
  await fetch(`/messages/${id}`, { method: 'DELETE' });
}

// Update a message
export async function updateMessage(id, newText) {
  if (!newText) throw new Error('Text is required for update');
  await fetch(`/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newText }),
  });
}


// Render a message (prepends it at the top)
function renderMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.id = message._id;

  const dateAdded = new Date(message.createdAt).toLocaleString(); // Format date

  messageDiv.innerHTML = `
<div class="chat-container">
    <div class="chat-bubble">
        <div class="c-action-buttons-top">
            <div style="margin-right: 0px;">
                <a href="#" class="action-btn" onclick="handleDelete('${message._id}')">
                  <i class="small material-icons">delete_forever</i>
                </a>
                <a href="#" class="action-btn" onclick="handleUpdate('${message._id}')">
                  <i class="small material-icons">edit</i>
                </a>
            </div>
        </div>
        <p class="chat-text">${message.text}</p>
        <div class="datesubmitted">Posted on: ${dateAdded}</div>
    </div>
</div>
  `;
  messagesDiv.prepend(messageDiv); // Prepend to show newest at the top
}

// Handle fetching and rendering messages
async function loadMessages() {
  try {
    const messages = await fetchMessages();
    messagesDiv.innerHTML = ''; // Clear the current list
    messages.forEach(renderMessage); // Render each message
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
}

// Handle adding a message
async function handleAddMessage() {
  const text = messageInput.value;
  if (!text) return alert('Please enter a message');
  try {
    await addMessage(text);
    messageInput.value = '';
  } catch (error) {
    console.error('Failed to add message:', error);
  }
}

// Handle deleting a message
async function handleDelete(id) {
  try {
    await deleteMessage(id);
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
}

// Handle updating a message
async function handleUpdate(id) {
  const newText = prompt('Enter new text');
  if (!newText) return;
  try {
    await updateMessage(id, newText);
  } catch (error) {
    console.error('Failed to update message:', error);
  }
}

// Real-time updates
socket.on('message-added', (message) => {
  renderMessage(message); // Prepend the new message
});

socket.on('messages-updated', (sortedMessages) => {
  messagesDiv.innerHTML = ''; // Clear the current list
  sortedMessages.forEach(renderMessage); // Render each message in the correct order
});

socket.on('message-deleted', () => {
  loadMessages(); // Refresh all messages
});

// Initial load
loadMessages();

$(document).ready(function () {
  $('.modal').modal();

  // Close modal on submit button click
  $('#submit-button').click(function () {
    $('#modal1').modal('close');
  });

  // Close modal on close button click
  $('#modal-close').click(function () {
    $('#modal1').modal('close');
  });
});