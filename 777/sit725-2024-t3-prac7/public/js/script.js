// Add Thought Cards to the DOM
function addThoughtCards(thoughts) {
    const submittedDataDiv = $("#submitted-data");
    submittedDataDiv.empty(); // Clear previous entries to avoid duplication
    thoughts.forEach(thought => {
        let tags = thought.tags.join(', ');
        let cardHTML = `
            <div class="col s12 m6 l4 thought-card">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${thought.thoughts}</span>
                        <p>Date Submitted: ${new Date(thought.timestamp).toLocaleString()}</p>
                        <p>Tags: ${tags}</p>
                    </div>
                </div>
            </div>
        `;
        // Add the card to the top of the container
        submittedDataDiv.prepend(cardHTML);
    });
}

// Fetch All Thoughts and Render Them
function fetchAllThoughts() {
    $.get('/getAllThoughts', (data) => {
        // Handle if no data is returned
        if (!data || data.length === 0) {
            console.warn('No thoughts found.');
            $("#submitted-data").html("<p>No thoughts available.</p>");
            return;
        }
        // Sort thoughts by timestamp (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        addThoughtCards(sortedData);
    }).fail((err) => {
        console.error('Error fetching data:', err);
        $("#submitted-data").html("<p>Error loading thoughts. Please try again later.</p>");
    });
}

/*

// Submit Form Data
function submitForm() {
    const formData = {
        thoughts: $('#thoughts').val(),
        tags: $('#tags').val().split(',').map(tag => tag.trim()) // Ensure tags are array
    };

    // Simple validation
    if (!formData.thoughts) {
        alert("Please enter your thoughts!");
        return;
    }

    if (!formData.tags || formData.tags.length === 0 || formData.tags[0] === "") {
        alert("Please enter at least one tag!");
        return;
    }

    $.ajax({
        url: '/register',
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json', // Explicitly set content type
        success: (response) => {
            console.log('Data submitted successfully!', response);
            fetchAllThoughts(); // Fetch and update thoughts without a full page reload
            $('#thoughts').val(''); // Clear form inputs
            $('#tags').val('');
        },
        error: (err) => {
            console.error('Error saving data:', err);
            alert("Error saving data. Please try again later.");
        }
    });
}

*/



// Real-Time Updates with Socket.IO
let socket = io();
socket.on('newThought', (data) => {
    const tags = data.tags.join(', ');
    const newCard = `
        <div class="col s12 m6 l4 thought-card">
            <div class="card">
                <div class="card-content">
                    <span class="card-title">${data.thoughts}</span>
                    <p>Date Submitted: ${new Date(data.timestamp).toLocaleString()}</p>
                    <p>Tags: ${tags}</p>
                </div>
            </div>
        </div>
    `;
    // Prepend the new card to the top of the list
    $("#submitted-data").prepend(newCard);
});

// Document Ready
$(document).ready(function() {
    fetchAllThoughts(); // Initial fetch
});
