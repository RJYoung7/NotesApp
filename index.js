const allNotes = document.querySelector('#allNotes');
let converter = new showdown.Converter();
/****************************** INITIALIZE PAGE **********************************/
// On page load, get notes from local storage
const jsonNoteArr = localStorage.getItem('Notes');
const noteArr = [];
if (jsonNoteArr !== null) {
    JSON.parse(jsonNoteArr).forEach(element => noteArr.push(element));
}

populateNotesList();

/********************************* FUNCTIONS ************************************/

// The following function removes any notes on the page and then appends any notes
// within the noteArr
function populateNotesList() {

    // Action only occurs if the noteArr has data
    if (noteArr !== null) {
        // Removes all current notes
        while (allNotes.firstChild) {
            allNotes.removeChild(allNotes.lastChild);
        }

        // // Adds all current notes
        for (let i = noteArr.length - 1; i >= 0; i--) {
            allNotes.appendChild(prepareNote(i));
        }
    }
}

// The following function returns a div the represents a note
function noteTemplate() {
    const newNoteDiv = document.createElement('div');
    newNoteDiv.classList.add('note');

    const noteTemplate = `
        <div class='btnDiv'>
            <button class='save' id='saveBtn' type='button' disabled='true'>Saved</button>
            <button class='delete' id='deleteBtn' type='button'>Delete</button>
        </div>
        <div id='inputNote' class='inputNote'></div>
    `;
    newNoteDiv.innerHTML = noteTemplate;
    return newNoteDiv;
}

// The following function returns a prepared note.  
// A prepared note contains specific data.
function prepareNote(i) {
    // Get a note template
    const noteDiv = noteTemplate();

    // Select the paragraph within the note div
    let newDiv = noteDiv.querySelector('#inputNote');

    // Set the inner text of the paragraph to the existing note
    if (noteArr[i] !== undefined) {
        newDiv.innerHTML = converter.makeHtml(noteArr[i]);
    } else {
        // Push a blank note to the note DS and assign the blank note to the inner text
        noteArr.push('');
        newDiv.innerHTML = converter.makeHtml(noteArr[i]);

    }

    // Give the div and the paragraph an ID of the index where it resides in the DS
    noteDiv.id = i;
    // newDiv.id = i;

    // Return the note div
    return noteDiv;
}

// The following function updates the note in the noteArr and updates the local storage
// with the new data
const updateNote = function updateNote(draft, i) {
    noteArr[i] = draft;
    localStorage.setItem('Notes', JSON.stringify(noteArr));
}

// The following function sets up the note to be edited
function edit(target) {

    // The save button
    const saveBtn = target.previousElementSibling.firstElementChild;

    // Activate save button
    saveBtn.disabled = false;
    saveBtn.innerText = 'Save';

    //Create a text area element and add class/id
    let draft = document.createElement('textarea');
    draft.classList.add('inputNote');
    draft.id = target.parentNode.id;

    // Set the text of the text area to the selected notes text
    draft.value = converter.makeMarkdown(target.innerHTML);

    // Replace the p element with the text area element
    target.parentNode.replaceChild(draft, target);
    draft.focus();
}


/************************************* EVENT LISTENERS ******************************/
// Event listener to add a note
document.querySelector('#addBtn').addEventListener('click', () => {
    const newNote = prepareNote(noteArr.length);
    allNotes.prepend(newNote);
    edit(newNote.querySelector('#inputNote'));
});

// Event listener to edit a note
document.getElementById('allNotes').addEventListener('click', function(e) {
    if (e.target && e.target.matches('div.inputNote')) {
        // Replace the paragraph with a input text area
        edit(e.target);
    }
});

// Event listener to save a note
document.getElementById('allNotes').addEventListener('click', function(e) {
    if (e.target && e.target.matches('#saveBtn')) {
        const inputNote = e.target.parentNode.nextElementSibling;
        const parent = inputNote.parentNode;
        updateNote(inputNote.value, inputNote.id);
        parent.parentNode.replaceChild(prepareNote(inputNote.id), parent);
    }
});

// Event listener to delete a note
document.getElementById('allNotes').addEventListener('click', function(e) {
    if (e.target && e.target.matches('#deleteBtn')) {
        const itemToRemove = e.target.parentNode.parentNode;
        const inputNote = e.target.parentNode.nextElementSibling;
        noteArr.splice(inputNote.id, 1);
        localStorage.setItem('Notes', JSON.stringify(noteArr));
        itemToRemove.remove();
    }
});