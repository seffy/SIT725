const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = '<div class="col s12 m6 l4">'+
                '<div class="card">'+
                    '<div class="card-content">'
                        '<span class="card-title">'+item.thoughts+'</span>'+
                        '<p>'+item.tags+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>';
        $("#card-section").append(itemToAppend)
    });
}

const formSumitted = () => {
    let formData = {};
    formData.thoughts = $('#thoughts').val();
    formData.tags = $('#tags').val();

    console.log(formData);
    postThoughts(formData);
}

function postThoughts(thoughts) {
    $.ajax({
        url:'/api/thoughts',
        type:'POST',
        data:thoughts,
        success: (result) => {
            if (result.statusCode === 201) {
                alert('Thoughts Posted');
                location.reload();
            }
        }
    });
}

function getAllThoughts() {
    $.get('/api/thoughts',(result)=>{
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
    getAllThoughts();
    console.log('ready');
});