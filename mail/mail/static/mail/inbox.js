document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('#compose-form').addEventListener('submit', event => {
    event.preventDefault();
    submit_email();
  });
}); 

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      if (email.read === false) {
        backG = 'White'
      } else {
        backG = '#c4c4c4'
      }
      const div= document.createElement("div");
        div.innerHTML = `<span class="form-control" style="background-color:${backG};"> <b> From: ${email.sender}</b> ${email.subject} <u style="color:#b5b5b5; font-size:12px;"> ${email.timestamp} </u>`;
        div.addEventListener('click', function() {
          view_mail(email, mailbox)
        });
        document.getElementById("emails-view").appendChild(div);
      });
  });
}

function view_mail(email, mailbox) {
  const email_view = document.querySelector('#emails-view');
  fetch(`/emails/${email.id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      document.querySelector('#emails-view').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';
    
      email_view.innerHTML = `<div>
        <h3> ${email.subject}</h3>
          <b> From: ${email.sender} | To: ${email.recipients} </b> <u style="color:#b5b5b5; font-size:12px;"> ${email.timestamp} </u>
      </div>
      <hr>
      <div style="font-size:20px;">${email.body}</div>
      <hr>
      <button class="btn btn-sm btn-outline-primary mt-2" id="reply" onclick="reply('${email.id}');">Reply</button>
      <button class="btn btn-sm btn-outline-primary mt-2" id="archive" onclick="archive_email(${email.id}, ${email.archived});">Archive/Unarchive</button>`;
      // ... do something else with email ...
      if (mailbox === 'inbox') {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
      }
  });
}

function submit_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  });
}

function reply(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {    
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Put values in composition fields
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    document.querySelector('#compose-body').value = `(On "${email.timestamp}", "${email.sender}" wrote: "${email.body}")`;

    if (email.subject.startsWith("RE: ")) {
      document.querySelector('#compose-subject').value = `${email.subject}`;    
    } else {
      document.querySelector('#compose-subject').value = `RE: ${email.subject}`;    
    }
  });
}

function archive_email(id, archived) {

  // Change archived state
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: !archived
    })
  })
  .then(() => {
    load_mailbox('inbox');
  })
}