// Function to fetch all thoughts from the server
async function fetchAllThoughts() {
    try {
        const response = await fetch('/getAllThoughts'); // Fetch all thoughts
        if (!response.ok) throw new Error('Network response was not ok');
        const thoughts = await response.json();
        updateThoughtsList(thoughts);
    } catch (error) {
        console.error('Error fetching thoughts:', error);
    }
}

// Format timestamp to a readable date
function formatTimestampToDate(timestamp) {
    if (!timestamp) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(timestamp).toLocaleString(undefined, options);
}

// Style tags for display
function styleTags(tags) {
    if (!tags) return ''; // Handle undefined or null cases
    if (Array.isArray(tags)) {
        tags = tags.join(' '); // Convert array to a space-separated string
    }

    return tags.split(' ').map(tag => `
        <span style="background-color: #cccccc; color: #ffffff; padding: 3px 8px; border-radius: 4px; margin-right: 5px; font-weight: bold;">
            ${tag}
        </span>
    `).join(' ');
}

// Update the thoughts list in the DOM
function updateThoughtsList(thoughts) {
    const thoughtsList = document.getElementById('thoughtsList');
    thoughtsList.innerHTML = ''; // Clear the list

    thoughts.forEach(thought => {
        const styledTags = styleTags(thought.tags || []);
        const formattedDate = formatTimestampToDate(thought.timestamp); // Convert timestamp
        const card = `
            <div class="col s12 m6 l4 thought-card">
                <div class="card">
                    <div class="card-content">
                        <div class="quote-container">
                            <div class="left-quote">“</div>
                            <p class="quote-text">
                                <span class="card-title"> ${thought.thoughts || 'N/A'}</span>
                            </p>
                        </div>
                        <p class="datesubmitted">Date Submitted: ${formattedDate}</p>
                        <p class="tags">Tags: ${styledTags || 'None'}</p>
                    </div>
                </div>
            </div>`;
        thoughtsList.innerHTML += card;
    });
}

// Fetch all thoughts when the page loads
document.addEventListener('DOMContentLoaded', fetchAllThoughts);

// Listen for new thoughts from the server
socket.on('newThought', (newThought) => {
    const styledTags = styleTags(newThought.tags || []);
    const formattedDate = formatTimestampToDate(newThought.timestamp); // Convert timestamp
    const card = `
        <div class="col s12 m6 l4 thought-card">
            <div class="card">
                <div class="card-content">
                    <div class="quote-container">
                        <div class="left-quote">“</div>
                        <p class="quote-text">
                            <span class="card-title"> ${newThought.thoughts || 'N/A'}</span>
                        </p>
                    </div>
                    <p class="datesubmitted">Date Submitted: ${formattedDate}</p>
                    <p class="tags">Tags: ${styledTags || 'None'}</p>
                </div>
            </div>
        </div>`;
    document.getElementById('thoughtsList').innerHTML += card;
});

// Handle form submission
document.getElementById('thoughtForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.target);
    const thoughts = formData.get('thoughts');
    const tags = formData.get('tags');
    const timestamp = Date.now(); // Use timestamp

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ thoughts, tags, timestamp }), // Send timestamp
        });
        const result = await response.json();
        console.log(result.message);
        event.target.reset(); // Clear the form
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});