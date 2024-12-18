// Fetch all messages
async function fetchMessages() {
    const res = await fetch('/messages');
    const messages = await res.json();
    messagesDiv.innerHTML = ''; // Clear the current list
    messages.forEach(renderMessage); // Render each message in sorted order
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
                  <a href="#" class="action-btn" onclick="deleteMessage('${message._id}')"><i class="small material-icons">delete_forever</i></a>
                      <a href="#" class="action-btn" onclick="updateMessage('${message._id}')">  <i class="small material-icons">edit</i></a>
                 </div>
          </div>
              <p class="chat-text">${message.text}</p>
        <div class="datesubmitted">Posted on: ${dateAdded}</div>
      </div>
  </div>
    `;
    messagesDiv.prepend(messageDiv); // Prepend to show newest at the top
  }

  // Initial fetch
fetchMessages();
