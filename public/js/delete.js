$(".deleteNote").on("click", confirmDeleteNote);

function confirmDeleteNote(){

    let noteName = $(this).next().html();

    let deleteNote = confirm(`Delete record ${noteName} ?`);

    if (deleteNote) {

        let noteId = $(this).attr("noteId");

        window.location.href = `/note/delete?noteId=${noteId}`;

    }
}
