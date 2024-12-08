const addCards = (items) => {
    items.forEach(item => {
        let styledTags = styleTags(item.tags);
        let itemToAppend = '<div class="col s12 m6 l3">'+
                '<div class="card">'+
                    '<div class="card-content">'+
                        '<p class="bquote"> <br><span class="card-title">'+item.title+'</span></p>'+
                       '<p>'+styledTags+'</p>'+
                       '<p class="dateposted"> Date posted: '+item.datePosted+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>';
        $("#card-section").append(itemToAppend)
    });
}

// Function to wrap each word in a span with a background style
const styleTags = (tags) => {
    return tags.split(' ').map(word => `<span class="word-style">${word}</span>`).join(' ');
}

const formSumitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.tags = $('#tags').val();
    formData.datePosted = new Date().toLocaleString(); // Capture current date and time

    console.log(formData);
    postCat(formData);
}

function postCat(cat) {
    $.ajax({
        url:'/api/cat',
        type:'POST',
        data:cat,
        success: (result) => {
            if (result.statusCode === 201) {
                alert('cat posted');
                location.reload();
            }
        }
    });
}

function getAllCats() {
    $.get('/api/cat',(result)=>{
        if (result.statusCode === 200) {
            addCards(result.data);
        }
    });
}

let socket = io();
socket.on('number',(msg)=>{
    console.log('Random Number: ' + msg);
});

$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('#formSubmit').click(()=>{
        formSumitted();
    });
    $('.modal').modal();
    getAllCats();
    console.log('ready');
});