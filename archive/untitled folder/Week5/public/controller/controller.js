const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Fetch all messages
export async function fetchMessages() {
  const res = await fetch('/messages');
  const messages = await res.json();

  messagesDiv.innerHTML = ''; // Clear the current list
  messages.forEach(renderMessage); // Render each message in sorted order
}

export async function addMessage() {
  const text = messageInput.value;
  if (!text) return alert('Please enter a message');
  try {
    const res = await fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      renderMessage(newMessage); // Prepend new message immediately
    } else {
      alert('Failed to add message');
    }
  } catch (error) {
    console.error('Error adding message:', error);
  }
}

// Delete a message
export async function deleteMessage(id) {
  try {
    const res = await fetch(`/messages/${id}`, { method: 'DELETE' });

    if (res.ok) {
      fetchMessages(); // Re-fetch all messages after deletion
    } else {
      alert('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
  }
}

// Update a message
export async function updateMessage(id) {
  const newText = prompt('Enter new text');
  if (!newText) return;
  try {
    const res = await fetch(`/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    if (res.ok) {
      fetchMessages(); // Re-fetch all messages to maintain sorting
    } else {
      alert('Failed to update message');
    }
  } catch (error) {
    console.error('Error updating message:', error);
  }
}

// Render a message (prepends it at the top)
export function renderMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.id = message._id;

  const dateAdded = new Date(message.createdAt).toLocaleString(); // Format date

  messageDiv.innerHTML = `
    <div class="chat-container">
      <div class="chat-bubble">
          <div class="c-action-buttons-top">
              <div style="margin-right: 0px;">
                <a href="#" class="action-btn" onclick="deleteMessage('${message._id}')">
                  <i class="small material-icons">delete_forever</i>
                </a>
                <a href="#" class="action-btn" onclick="updateMessage('${message._id}')">
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