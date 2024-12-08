const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = '<div class="col s4 center-align">'+
                '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="'+item.path+'">'+
                '</div><div class="card-content">'+
                '<span class="card-title activator grey-text text-darken-4">'+item.title+'<i class="material-icons right">more_vert</i></span><p><a href="#">'+item.link+'</a></p></div>'+
                '<div class="card-reveal">'+
                '<span class="card-title grey-text text-darken-4">'+item.subTitle+'<i class="material-icons right">close</i></span>'+
                '<p class="card-text">'+item.description+'</p>'+
                '</div></div></div>';
        $("#card-section").append(itemToAppend)
    });
}

const formSumitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.path = $('#path').val();
    formData.subTitle = $('#subTitle').val();
    formData.description = $('#description').val();

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