


const socket = io('http://localhost:3000');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Fetch all messages
async function fetchMessages() {
  const res = await fetch('/messages');
  const messages = await res.json();
  messagesDiv.innerHTML = '';
  messages.forEach((message) => {
    const messageDiv = document.createElement('div');
    messageDiv.id = message._id;
    messageDiv.innerHTML = `
      <p>${message.text}</p>
      <button onclick="deleteMessage('${message._id}')">Delete</button>
      <button onclick="updateMessage('${message._id}')">Update</button>
    `;
    messagesDiv.appendChild(messageDiv);
  });
}

// Add a new message
async function addMessage() {
  const text = messageInput.value;
  if (!text) return alert('Please enter a message');
  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  messageInput.value = '';
}

// Delete a message
async function deleteMessage(id) {
  await fetch(`/messages/${id}`, { method: 'DELETE' });
}

// Update a message
async function updateMessage(id) {
  const newText = prompt('Enter new text');
  if (!newText) return;
  await fetch(`/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newText }),
  });
}

// Real-time updates
socket.on('message-added', (message) => {
  fetchMessages();
});

socket.on('message-updated', (message) => {
  fetchMessages();
});

socket.on('message-deleted', (message) => {
  fetchMessages();
});

// Initial fetch
fetchMessages();