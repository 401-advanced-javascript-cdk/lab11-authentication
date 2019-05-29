## Lab 11 - Authentication
Implements Basic auth signup and signin routes, and secures books routes with auth middleware
### Author: Chris Kozlowski

### Links and Resources
* [Submission PR](https://github.com/401-advanced-javascript-cdk/lab11-authentication/pull/1)
* [Travis](https://travis-ci.com/401-advanced-javascript-cdk/lab11-authentication)
* [Heroku Deployment](https://lab11-authentication.herokuapp.com/)

### Modules
#### `auth/router.js`
Contains routes to for Basic auth sign-up and sign-in
#### `auth/middleware.js`
Pulls Bearer auth from headers and applies the user and token to the request body
#### `auth/users-model.js`
Holds the schema for users and methods for hashing passwords, extracting bearer auth, and creating tokens with jwt.
#### `routes/books.js`
Holds routes for displaying book data.  Implements auth middleware to secure routes

#### Operation
Users can be created by POSTing to the /signup route and supplying a username and password.  Returns a token in the body and header for a successful POST.
Users can sign in by POSTing to the /signin route with their username and password.
GET requests to /books and /books:id must include a username and password

#### Testing
`npm test`