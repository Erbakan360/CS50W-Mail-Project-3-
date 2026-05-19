# CS50W-Mail-Project-3-

A single-page front-end for an email client that makes API calls to send and receive emails.

Key Features: A fully asynchronous user interface built with JavaScript. Users can compose emails, view their Inbox/Sent/Archive mailboxes, and archive or reply to specific messages without refreshing the page.

Tech: JavaScript (ES6), Python, Django (as API), HTML, CSS.

Requirements: https://cs50.harvard.edu/web/projects/3/mail/

 Setup Instructions:
--------------------------------------------------
0. Download code/ Clone repository
   ```
   git clone https://github.com/Erbakan360/CS50W-Mail-Project-3.git
   ```
1. Change directory to the wiki
   ```
   cd mail
   ```

2. Install dependencies:
   ```
   pip install django markdown2
   ```

3. Run database migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
  
4. Start the development server:
    ```
    python manage.py runserver
    ```
