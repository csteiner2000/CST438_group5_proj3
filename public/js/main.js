$("a").on("click", displayNoteInfo);

async function displayNoteInfo(){
    var myModal = new bootstrap.Modal(document.getElementById('noteModal'));
    myModal.show();

    let noteId = $(this).attr("id");

    let url = `/api/noteInfo?noteId=${noteId}`;
    let response = await fetch(url);
    let data = await response.json();

    console.log(data[0]);

    $(".modal-title").html(data[0].noteTitle);

    $("#noteInfo").append(`<b>Note Content:</b> ${data[0].noteText} <br>`);

    $("#noteId").val(data[0].noteId);
    $('#noteId').css('display', 'none');
}

$("#noteModal").on("hidden.bs.modal", function(){
    $("#noteInfo").html("");
    $("#noteId").html("");
});


