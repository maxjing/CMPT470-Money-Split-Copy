# Money Split

run
`docker-compose build && docker-compose up`

Open browser and navigate to the frontend which queries our backend:
http://localhost:3000/

Backend:
http://localhost:8080

Some data is already prepopulated (Feel free to create accounts as well):

Credentials: 

email: user1@example.com
password: justTesting1

email: user2@example.com
password: justTesting2

email: user3@example.com
password: justTesting3

email: user4@example.com
password: justTesting4

email: user5@example.com
password: justTesting5

Groups:
- Group 1
   - user1@example.com, user2@example.com, 2 anonymous users
   -  2 expenses
- Group 2
    - user2@example.com, user3@example.com
    - 2 expenses
- Group 3
    - user4@example.com, user5@example.com
    - 2 expenses

Payment Histories:
    - objects for user1@example.com, user3@example.com, user5@example.com

Final Implementation Notes:
- Changes from the Checkpoint
    - Payment functionality fully implemented
        - Payment for anonymous users (users without an email registered in the database) implemented
        - Payment split options implemented (equally, by %, etc)
    - Implemented Django Rest Framework and successfully serialized the existing Django models and view functions, effectively turning Django implementation into a backend api
    - Integrated React frontend in a separate container and successfully linked it with the Django backend
    - User authentication integrated on the frontend as well
    - Refresh Tokens
        - users will perform actions with JWT tokens attached to each response
        - the token will expire so the system will try to fetch a new token before expiry
        - if the token expires the user will automatically be logged out and be prompted to login again
    - Dashboard functionality which gives an overview of expenses and acts a central navigation page
        - Total balance tells the user whether he/she owes (negative) more or should expect money back (positive) 
        - A summary of the sum each specific person owes you
    - Some functionality of the site can still be access through the backend (port 8080), notably the user log in / log out / sign up, but the rest will not work
        - These functionalities are deprecated and can be done through the frontend instead (port 3000)
        
If a user is not logged in, they will be redirected to the log in page.

If the user doesn't have an account, then there is a link that goes to the sign up page.

After logging (or creating a new user), the user is redirected to the dashboard where the user can see their total balance
along with what others owe them or what they owe to others. The name of the personal expenses will also include a link
to the expense details page. Lastly, at the end of each row, there is a "Make Payment" button that brings users to a page where they can enter
the amount they're paying for. Right now, the page will not allow an overpayment, but there is no error messages added for this form and a few other forms yet.

After a payment is made, once the expense amount hits 0, then the expense will no longer will be present in the "You owe" or "You are owed" list.

From the dashboard, the User can create a new group. Clicking on a group will direct the user to a page where the user can see the members of the group
and existing expenses for that group. There is also a Group tab on the dashboard that shows the user all the groups the user belongs to, and the description for each group

Within a group, a user can add any email to the group, even if they have not signed up for an account. When a new person comes
and signs up for a new account and their email has been referenced in previous expenses or groups, they will login to see everything
associated with that email.

There is a navigation bar at the top that allows users to go back to the home page, check their groups, as well as a history of their payments.
On the right, there is Welcome message, which users can click to be brought to a "My Account", but cannot edit their details as of right now. Lastly,
next to the welcome message, there is the "Log Out" button which they can click to log out and be redirected to the Log In page.

# Known Issues

Refresh Tokens
- The refresh tokens may not always refresh properly and force the user to log out. The navbar may say that you are 
logged despite you being redirected to the login page. To remedy this, you can click the log out button and then relog.

Anonymous Payments
- When a user creates an expense registered to the user's self, the anon payment link is redundant as the user doesn't need to pay himself. 
Clicking the link brings you to a payment page but you cant do anything. Ideally the user should be met with "Expense already complete" message.

Repeated Get Requests Sent
- On some pages, when a GET request is sent to the backend, there will be ocasionally 2 GET requests sent, resulting double the responses. In some case, this may
result in the page flashing two times. This is most notable when going to a page as an unauthorized user (a group page), which results in two alert pops instead of one.