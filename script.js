// "use strict";
const CONTACTS_URL = 'http://5dd3d5ba8b5e080014dc4bfa.mockapi.io/contacts';

const DELETE_BTN_CLASS = 'delete-btn';
const EDIT_BTN_CLASS = 'edit-btn';

const $contactNameInput = $('#addContactName');
const $contactSurnameInput = $('#addContactSurname');
const $contactEmailInput = $('#addContactEmail');
const $contactPhoneInput = $('#addContactPhone');
const $contactDateInput = $('.datepicker');

const $contactNameEdit = $('#editContactName');
const $contactSurnameEdit = $('#editContactSurname');
const $contactEmailEdit = $('#editContactEmail');
const $contactPhoneEdit = $('#editContactPhone');
const $contactDateEdit = $('.datepicker');

const contactsList = document.getElementById('contactsList');
const formInputs = document.querySelectorAll('.form-input');
const $rowContactTemplate = $('#tdTemplate').html();

let contacts = [];

let editDialog;
let dialog;

$('#contactsList').on('click', '.delete-btn', onRowContactList);
$('#contactsList').on('click', '.edit-btn', onRowContactList);
$('#addContactBtn').on('click', onAddContactBtnClick);


function initDatepicker() {
   $( ".datepicker" ).datepicker();
}

function onAddContactBtnClick() {
    dialog.dialog('open');
}


function initDialog() {

    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 588,
        width: 350,
        modal: true,
        buttons: {
          "Create contact": onAddContactFormSubmit,
        Cancel: function() {
            dialog.dialog( "close" );
            }
        },
        close: function() {
        form[ 0 ].reset();
        }
  });
    const form = dialog.find( "form" ).on( "submit", onAddContactFormSubmit);
}

init();

function init() {
    initDialog();
    getContacts();
    initDatepicker();
    initEditDialog();
}

function getContacts() {
    return fetch(CONTACTS_URL)
    .then(resp =>resp.json())
    .then(setContacts)
    .then(renderContacts);
}

function setContacts(data) {
    return (contacts = data);
}

function renderContacts(data) {
    contactsList.innerHTML = data.map(generateContactHTML).join('\n');
    
}

function generateContactHTML(contact) {
    return $rowContactTemplate
    .replace('{{id}}', contact.id)
    .replace('{{name}}', contact.name)
    .replace('{{surname}}', contact.surname)
    .replace('{{email}}', contact.email)
    .replace('{{phone}}', contact.phone)
    .replace('{{date}}', contact.date);
}

function onAddContactFormSubmit(event) {
    event.preventDefault();
    createUser();
}

function createUser() {
    const contact = {
        name:  $contactNameInput.val(),
        surname: $contactSurnameInput.val(),
        email: $contactEmailInput.val(),
        phone: $contactPhoneInput.val(),
        date: $contactDateInput.val()
    };

    fetch(CONTACTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(resp => resp.json())
    .then(addContact);
    clear();
    dialog.dialog( "close" );
}

function addContact(contact) {
    contacts.push(contact);
    renderContacts(contacts);
}

function onRowContactList(e) {
    switch(true) {
        case e.target.classList.contains(DELETE_BTN_CLASS):
            console.log('click delete');
            deleteContact(e.target.parentNode.parentNode.dataset.id);
            break;
        case e.target.classList.contains(EDIT_BTN_CLASS):
           onEditContactBtnClick(e.target.parentNode.parentNode.dataset.id);
            break;
    }
}

function onEditContactBtnClick(id) {
    editDialog.dialog('open');
    editContact(id);
}


function initEditDialog() {

    editDialog = $( "#edit-dialog-form" ).dialog({
        autoOpen: false,
        height: 588,
        width: 350,
        modal: true,
        buttons: {
          "Update contact": updateContact,
        Cancel: function() {
            editDialog.dialog( "close" );
            }
        },
        close: function() {
        form[ 0 ].reset();
        }
  });
    const form = editDialog.find( "form" ).on( "submit", updateContact);
}


function editContact(id) {
    const user = contacts.find((item) => item.id === id);
    fillForm(user);
}

function fillForm(user) {
    $contactNameEdit.val(user.name);
    $contactSurnameEdit.val(user.surname);
    $contactEmailEdit.val(user.email);
    $contactPhoneEdit.val(user.phone);
    $contactDateEdit.val(user.date);
    $('#idInput').val(user.id);
    console.log(user.id);
    fillUpdateForm(user);
}

function deleteContact(id) {
    fetch(`${CONTACTS_URL}/${id}`, {
        method: 'DELETE',
    });
    contacts = contacts.filter((contact) => contact.id !== id);
    renderContacts(contacts);
}
function fillUpdateForm() {
    const obj = {};
    for(let i=0; i<formInputs.length; i++) {
        obj[formInputs[i].name] = formInputs[i].value;
        
    }
    console.log(obj);
    return obj;
}

function submitUser() {
    const userUpdate = fillUpdateForm();
    updateContact(userUpdate);
}

function updateContact(userUpdate) {
    console.log(userUpdate);

    fetch(`${CONTACTS_URL}/${userUpdate.id}`, {//
        
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userUpdate)
    });
    editDialog.dialog( "close" );

    console.log('user.id', userUpdate.id);
    console.log(userUpdate);
    console.log(contacts);
    contacts = contacts.map((item) => {item.id !== userUpdate.id ? userUpdate : item});
    
   
    
    // renderContacts(contacts);
}

function clear() {
    $contactNameInput.val('');
    $contactSurnameInput.val('');
    $contactEmailInput.val('');
    $contactPhoneInput.val('');
    $contactDateInput.val('');
}
