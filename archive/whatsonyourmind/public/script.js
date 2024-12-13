const socket = io();
const form = document.getElementById('thoughtForm');
const thoughtsList = document.getElementById('thoughtsList');

// Fetch and display existing thoughts on page load
fetch('/api/thoughts')
    .then((response) => response.json())
    .then((thoughts) => {
        thoughts.forEach((thought) => {
            const li = document.createElement('li');
            li.textContent = thought.text;
            li.className = 'collection-item';
            thoughtsList.appendChild(li);
        });
    })
    .catch((err) => console.error('Failed to fetch thoughts:', err));

// Add new thought via WebSocket
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const thoughtInput = document.getElementById('thought');
    const thought = thoughtInput.value.trim();
    if (thought) {
        // Send thought to server via WebSocket
        socket.emit('new-thought', thought);

        // Add to API for persistence
        fetch('/api/thoughts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: thought }),
        }).catch((err) => console.error('Failed to save thought:', err));

        thoughtInput.value = '';
    }
});

// Update thoughts in real-time
socket.on('update-thoughts', (thought) => {
    const li = document.createElement('li');
    li.textContent = thought;
    li.className = 'collection-item';
    thoughtsList.appendChild(li);
});
