# AddressBook app using Node.js, Express and PostgresSQL

This project is an example of how you could build RESTful webservices and an example website with Node, Express, and PostgreSQL.

# Project description
The AddressBook backend will be used by users to perform the following tasks:
* Register new account
* Login to existing account
* Manage the user's  contacts

# Technical Requirements
The backend should be able to server both mobile apps and websites using a RESTful API and has the following features
* Use Node.js
* Use a well-known framework (express) for API
* HTTP responses follow best practices related to status code definition and request/response headers
* API communicate with thier clients using JSON
* JSON Web Tokens are used to mantain stateless authentication
* Deploy to Heroku/AWS and discuss environment settings/ dev vs prod, etc.

# RESTful API services

## Authentication related REST webservices

### Register a new user<br/>
POST : /api/auth/register<br/>
Request :<br/>
``` [{username : angelina@gmail.com, password : "****"}] ``` <br/>
Response :<br/>
``` {"auth":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTUyMzkxNjY0MywiZXhwIjoxNTI0MDAzMDQzfQ.rOv0B2UQkRNAeL7XmAZfkLjKn0OEptoAIssmUbbu5tA","location":"/api/users/contacts/12"} ```

### Login a user
POST : /api/auth/login<br/>
Request :<br/>
```username : angelina@gmail.com, password : "****" ```<br/>
Response :<br/>
``` {"auth":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTUyMzkxNjY0MywiZXhwIjoxNTI0MDAzMDQzfQ.rOv0B2UQkRNAeL7XmAZfkLjKn0OEptoAIssmUbbu5tA","location":"/api/users/contacts/12"} ```

### Manage user profile
GET : /api/auth/profile/{userid}<br/>
Response :<br/>
``` {"id":1,"username":"test","password":"098f6bcd4621d37"} ```<br/>

## Addressbook contacts management related REST webservices

### Retrieve a list of contacts
GET : /api/contact/list<br/>
Response :<br/>
``` [{"id":22,"userid":66908,"firstname":"Wendy","lastname":"Johnson","phone":null},{"id":38,"userid":29,"firstname":"Bill","lastname":"Maher","phone":"408-321-1232"},{"id":25,"userid":30670,"firstname":"Gabrielle","lastname":"Matheson","phone":null},{"id":43,"userid":2,"firstname":"John","lastname":"Monroe","phone":"408-123-3210"] ```

### Create a new contact of a user
POST /api/contact/add/{userid}<br/>
Response :<br/>
```[{"id":61,"userid":2,"firstname":Brad,"lastname":Pitt,"phone":null}]```

### Update an existing contact of a user
POST api/contact/update/:id/users/:userid<br/>
Response :<br/>
``` [{"id":61,"userid":2,"firstname":"Bradd","lastname":"Pitt","phone":"408-421-1223"}] ```

### Delete an existing contact of a user
POST api/contact/delete/:id/users/:userid<br/>
Response :<br/>
```{"command":"DELETE","rowCount":1,"oid":null,"rows":[],"fields":[],"_parsers":[],"RowCtor":null,"rowAsArray":false}```


# Web Application deployed on AWS
* URL : http://ec2-107-21-84-133.compute-1.amazonaws.com:3000/
* test account :
    ``` username : test@mail.com,
        password : test
    ```

# Known issues in the webapplication
Webapp bug #1 : The edit button click on the first record in the contact list table may not work because that request is cached in the browser.
Webapp bug #2 : No token is delivered to the delete click button. The verify token works directly on the delete REST API and was tested using Postman.


