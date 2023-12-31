# API Documentation for Personal Finance Advisor

## Description

The Personal Finance Advisor API is a web service that provides functionality for managing user financial data and loan applications. The API allows access to user's (which can be a client, a bank worker or an administrator) data, as well as the ability to create and manage loan applications. An administator can create different loan types for calculating loan details. The API also provides information on maximum loan amounts, repayment schedules, and payment notes.

## Content:

- [Setup and Installation](#setup-and-installation)
- [Technical requirements](#technical-requirements)
- [Endpoints](#endpoints)
  - [Endpoint /register](#endpoint-register-back-to-content)
  - [Endpoint /login](#endpoint-login-back-to-content)
  - [Endpoint /user](#endpoint-users-back-to-content)
  - [Endpoint /loan_types](#endpoint-loan_types-back-to-content)
  - [Endpoint /max_available_amount](#endpoint-max_available_amount-back-to-content)
  - [Endpoint /documents](#endpoint-documents-back-to-content)
  - [Endpoint /applications](#endpoint-applications-back-to-content)
  - [Endpoint /application/{application_id}/approved](#endpoint-applicationapplication_idapproved-back-to-content)
  - [Endpoint /repayment_schedule](#endpoint-repayment_schedule-back-to-content)
  - [Endpoint /repayment_notes](#endpoint-repayment_notes-back-to-content)
- [Testing](#testing)

## Setup and Installation

**Installation Steps:**

Clone the repository using the following link:

```
git clone https://github.com/alesanka/FinanceAdvisor
```

Run the following command to install dependencies:

```
npm install
```

Launch Docker using the command:

```
docker-compose -f up -d
```

The application's base URL is:

```
http://localhost:5000/api/v1/
```

## Technical requirements

- Implementation language: JavaScript
- Framework: Express
- Database: PostgresSQL
- Use 18.18.1 LTS version of Node.js
- Docker container

## Endpoints

### Endpoint /register [(Back to content)](#content)

**Register a new user account.**

\*In case of registering user with the role 'client' - the "salary" field in request body is required.

Request:

```
POST /register
Content-Type: application/json
Request Body:
{
  "username": "anna",
  "password": "abrakadabra",
  "first_name": "Anna",
  "last_name": "Smith",
  "email": "thebestanna@email.com",
  "phone_number": "1234567890",
  "role": "client",
  "salary": 15000,
  "credit_story": true
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

'User was registered successfully. Id - 1'

```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

`Missing required parameter: ${field}`
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: 'Something went wrong during user registration',
    error: err.message,
}
```

### Endpoint /login [(Back to content)](#content)

**Login an existing user.**
When a user attempts to authenticate:
The system first verifies if the provided username exists within the database.
If the username is validated, the system compares the provided password with the one stored against that username.
On successful password validation, the system checks the user's scope.
If the scope is either 'worker' or 'admin', the system engages with the node-oauth2-server to retrieve an access token. Both the access and refresh tokens are then stored securely for subsequent interactions.
If the scope is neither 'worker' nor 'admin', only the password and username are verified.
Post-authentication, interactions involve token-based authorization. Users with 'worker' or 'admin' scope can access protected endpoints. Others are limited to public endpoints.
Each authorized request must include: Authorization: Bearer {{token}}.
Access tokens are valid for 1 hour. If an access token expires, a token-refresh process is mandated to obtain a new one.

Request:

```
POST /login
Content-Type: application/x-www-form-urlencoded
Request Body: {
        grant_type: password,
        scope: admin,
        client_id: this-client-id-is-for-demo-only,
        client_secret: this-secret-id-is-for-demo-only,
        username: maria,
        password: abrakadabra,
      }
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "accessToken": "9e84379ff46ee5d01f1212c19491473864baff98fc92515d94f289ce6e91414c",
    "refreshToken": "6a326acdc64827fe7445dc2980ad4c22b6cb5c9d801c37ee6d324f170e557a5b"
}
```

or

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
{
    'User logged in successfully'
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

`Missing parameter: "${field}" in requst body`

```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: 'Something went wrong during attempt to log in user.',
    error: err.message,
}
```

---

**Get refresh token.**

Request:

```
POST login/refresh_token
Content-Type: application/x-www-form-urlencoded
Request Body: {
        grant_type: refresh_token,
        client_id: this-client-id-is-for-demo-only,
        client_secret: this-secret-id-is-for-demo-only,
        refresh_token: {refresh_token}
      }
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "accessToken": "9e84379ff46ee5d01f1212c19491473864baff98fc92515d94f289ce6e91414c",
    "refreshToken": "6a326acdc64827fe7445dc2980ad4c22b6cb5c9d801c37ee6d324f170e557a5b"
}
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{ error: err.message }
```

## Endpoint /users [(Back to content)](#content)

**Retrieve the users profile information.**

\*public request

Request:

```
GET /users HTTP/1.1
```

Response:

```
[
  {
    "user_id": 1,
    "first_name": "Anna",
    "last_name": "Smith",
    "role": "client"
  },
  {
    "user_id": 2,
    "first_name": "George",
    "last_name": "Baker",
    "role": "worker"
  }
  // ... more users
]
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: 'Something went wrong during getting all users.',
    error: err.message,
}
```

---

**Retrieve a specific user's profile information by user id.**

\*protected request (available only for admin and worker with access_token)

Query Parameters:

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| `user_id` | number | Filter users by user_id. |

Request:

```
GET /users/:user_id
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "first_name": "Polya",
    "last_name": "B.",
    "email": "polina@email.com",
    "phone_number": "1234567890",
    "role": "client",
    "client_info": {
        "salary": 50000,
        "credit_story": false
    }
}
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    message: `Something went wrong during getting user ${userId}.`,
    error: err.message,
}
```

---

**Retrieve a list of users with optional query parameters for filtering and sorting.**

\*protected request (available only for admin and worker with access_token)

Query Parameters:

| Parameter      | Type    | Description                                                                         |
| -------------- | ------- | ----------------------------------------------------------------------------------- |
| `role`         | string  | Filter users by role (e.g., "client", "admin", "worker").                           |
| `salary`       | number  | Filter users by salary (e.g., 5000)(avaible only for role "client").                |
| `credit_story` | boolean | Filter users by provided credit story (e.g., true)(avaible only for role "client"). |
| `email`        | string  | Filter users by email (e.g., cool@email.com).                                       |
| `first_name`   | string  | Filter users by first name (e.g., "anna").                                          |
| `last_name`    | string  | Filter users by last name (e.g., "smith").                                          |
| `phone`        | string  | Filter users by phone (e.g., "1234567890").                                         |
| `sort`         | string  | Filter users by salary (only for role "client").                                    |

Request:

```
GET /users/filter?role=client&sort=salary HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

 {
        "_id_user": 5,
        "_first_name": "Kassia",
        "_last_name": "K.",
        "_email": "kasia@email.com",
        "_phone_number": "1234567890",
        "_role": "client",
        "client": {
            "_client_id": 3,
            "_user_id": 5,
            "_salary": 70000,
            "_credit_story": true
        }
    }
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8

'No users found matching the criteria.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong during getting users by parameters.`,
    error: err.message,
  }
```

---

**Update user information.**

\*protected request (available only for admin and worker with access_token)
There is a possibillity to update user's first_name, last_name, email, phone_number, salary and client_story (if user is a client).

Request:

```
PUT /users/:userId HTTP/1.1
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "phone_number": "9999999999"
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

`User ${userId} data updated successfully.`

```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'No data provided in request body.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong during updating user's data.`,
    error: err.message,
}
```

---

**Delete a user account.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /users/:user_id HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while deleting user.`,
  error: err.message,
}

```

## Endpoint /loan_types [(Back to content)](#content)

**Create a new type of loan.**

\*protected request (available only for admin and worker with access_token)
\*(only admins can do this, user_id is required for checking user's role)

Request:

```
POST /loan_types
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 4,
  "loan_type": "personal_loan",
  "interest_rate": 6,
  "loan_term": 36,
  "required_doc": "passport"
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

`Loan type was created successfully. Loan type id - ${loanId}`

```

In case of error response:

```
HTTP/1.1 409 Conflict
Content-Type: text/html; charset=utf-8

'Only admins can create loan types.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while creating new type loan.`,
   error: err.message,
}
```

---

**Retrieve the information about existing loan types.**

\*public request

Request:

```
GET /loan_types HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
        "loan_type_id": 1,
        "loan_type": "mortgage",
        "interest_rate": "4.00",
        "loan_term": 360,
        "required_doc": "purcase_agreement"
    }
    // ... more loan types
]
```

---

**Retrieve a specific loan type information.**

\*public request

Query Parameters:

| Parameter   | Type   | Description                 |
| ----------- | ------ | --------------------------- |
| `loan_type` | string | Get loan type by loan_type. |

Request:

```
GET /loan_types/:loan_type/
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_type_id": {loan_type_id},
  "loan_type": "personal_type",
  "interest_rate": 5.5,
  "loan_term": 12,
  "required_doc": "passport"
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

`No valid loan_type is provided`
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while getting loan type.`,
  error: err.message,
}
```

---

**Update loan type information.**

\*protected request (available only for admin and worker with access_token)
\*(only admins can do this, user_id is required for checking user's role)

Request:

```
PUT /loan_types/:loan_type_id
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 2,
  "interest_rate": 5.2
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

`Loan type's data with id - ${loanTypeId} was updated successfully.`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only admins can update loan types.
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   message: `Something went wrong while updating loan type.`,
  error: err.message,
}
```

---

**Delete loan type by loan type id.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /loan_types/:loan_type_id
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while deleting loan type.`,
    error: err.message,
}

```

## Endpoint /max_available_amount [(Back to content)](#content)

**Worker save information about max available loan amount for a client with requested loan type.**

\*protected request (available only for admin and worker with access_token)
\*(only workers can do this, user_id is required for checking user's role)

Request:

```
POST /max_available_amount
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "user_id": 4,
    "client_id": 2,
    "loan_type_id": 3
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

Max avaiable loan amount with id - ${id} was saved successfully.
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can save max available loan amounts.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while saving max available loan amount.`,
  error: err.message,
}
```

---

**Client can retrieve an information about max available loan amount by id**

\*public request

Query Parameters:

| Parameter            | Type   | Description                          |
| -------------------- | ------ | ------------------------------------ |
| `max_loan_amount_id` | number | Get max available loan amount by id. |

Request:

```
GET /max_available_amount/:max_loan_amount_id/
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "max_loan_amount": 4712878,
    "total_interest_amount": "3387122.15",
    "loan_type": "mortgage",
    "interest_rate": "4.00",
    "loan_term": 360
}
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while getting max available loan amount.`,
  error: err.message,
}
```

---

**Delete client's max loan amount.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /max_available_amount/:max_loan_amount_id/
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while deleting max loan application.`,
  error: err.message,
}

```

## Endpoint /applications [(Back to content)](#content)

**Create a new loan application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /applications
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "user_id": 4,
    "id": 1,
    "desired_loan_amount": 50000,
    "is_approved": false
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

Loan application was created successfully. Loan application id - ${loan_application_id}. Required doc - ${required_doc}.
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can create loan applications.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while creating new loan application.`,
    error: err.message,
}
```

---

**Retrieve all loans applications information.**

\*protected request (available only for admin and worker with access_token)

Request:

```
GET /applications HTTP/1.1
```

Response:

```
[
  {
    "application_id": 1,
    "desired_loan_amount": 50000,
    "application_date": "2023-10-13",
    "is_approved": true
  },
  {
    "application_id": 2,
    "desired_loan_amount": 10000,
    "application_date": "2023-11-02",
    "is_approved": false
  }
  // ... more applications
]
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: 'Something went wrong while getting all loan applications.',
    error: err.message,
}
```

---

**Delete a loan application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
DELETE /applications/:loan_application_id
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while deleting loan application.`,
    error: err.message,
}

```

## Endpoint /documents [(Back to content)](#content)

**Create a new document.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /documents
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "user_id": 2,
    "application_id": 1,
    "document_name": "Client passport",
    "document_type": "passport"
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

`Document was added successfully. Document id - ${docId}`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can add documents.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while adding document.`,
  error: err.message,
}
```

**Get all documents by application id.**

\*protected request (available only for admin and worker with access_token)

| Parameter        | Type    | Description                            |
| ---------------- | ------- | -------------------------------------- |
| `application_id` | integer | The unique ID of the loan application. |

Request:

```
Get /documents/:application_id
Authorization: Bearer {access_token}

```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "document_id": 1,
        "document_name": "Client passport",
        "document_type": "passport"
    }
]
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while finding documents by application id.`,
  error: err.message,
}
```

**Delete a document by document id.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /documents/:documentId HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while deleting document by id.`,
    error: err.message,
}

```

## Endpoint /application/{application_id}/approved [(Back to content)](#content)

**Approve the application with the loan amount desired by the client if the required documents are attached to the application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Query Parameters:

| Parameter        | Type    | Description                            |
| ---------------- | ------- | -------------------------------------- |
| `application_id` | integer | The unique ID of the loan application. |

Request:

```
PUT /application/{application_id}/approved/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 7
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

'Loan application status changed on approved'
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can create loan applications.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: `Something went wrong while updating status on application.`,
  error: err.message,
}
```

## Endpoint /repayment_schedule [(Back to content)](#content)

**Add a repayment schedule for a specific application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /repayment_schedule
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "application_id": 7,
    "user_id": 4
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

`Repayment schedule was created successfully. Id - ${repaymentScheduleIdandDate.repaymentScheduleId}. First date for payment - ${repaymentScheduleIdandDate.firstPaymentDate}`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can modify loan applications.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: 'Something went wrong during repayment schedule creation.',
  error: err.message,
}
```

---

**Update repayment schedule remaining balance.**

\*protected request (available only for admin and worker with access_token)
\*(only workers can do this, user_id is required for checking user's role)

Request:

```
PUT /repayment_schedule/:repayment_schedule_id/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 2,
  "new_balance": 5000
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

`Remaining balance in repayment shedule with id ${repayment_schedule_id} was updated.`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Access denied. Invalid user role.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   message: 'Something went wrong while updating remaing balance.',
  error: err.message,
}
```

---

**Get a month payment amount for specific date.**

Client can get a month payment amount for requested date.

\*public request

Query Parameters:

| Parameter               | Type    | Required | Description                                               |
| ----------------------- | ------- | -------- | --------------------------------------------------------- |
| `repayment_schedule_id` | integer | Yes      | The unique ID of the repayment schedule.                  |
| `year`                  | integer | Yes      | The year part of the date for which to find the payment.  |
| `month`                 | integer | Yes      | The month part of the date for which to find the payment. |

Request:

```
GET /repayment_schedule/note?repayment_schedule_id=2&year=2024&month=5
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "payment_amount": "2824.06"
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'Missing required parameters: repayment_schedule_id, year, and month'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: 'Something went wrong during getting month payment.',
  error: err.message,
}
```

---

**Delete a repayment schedule by repayment schedule id.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /repayment_schedule/:repayment_schedule_id/ HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while deleting repayment schedule by id.`,
    error: err.message,
}

```

## Endpoint /repayment_notes [(Back to content)](#content)

**Add a payment note for a client about payment amount and the payment date.**

After getting repayment_schedule_id a bank worker can create notes for client with month payment with dates of payment.

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /repayment_notes
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "repayment_schedule_id": 8,
    "user_id": 4,
    "repayment_date": "2024-05-01"
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

`Payment note created successfully. Id - ${noteId}`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can modify loan applications.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  message: 'Something went wrong during payment note creation.',
  error: err.message,
}
```

---

---

**Update payment note status to true in case the payment was recieved.**

\*protected request (available only for admin and worker with access_token)
\*(only workers can do this, user_id is required for checking user's role)

Request:

```
PUT /repayment_notes/:note_id/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 2,
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

`Notes payment status with id - ${req.params.note_id} was updated successfully.`
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Access denied. Invalid user role.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   message: 'Something went wrong while updating note status.',
  error: err.message,
}
```

---

**Delete a payment by id.**

\*protected request (available only for admin and worker with access_token)

Request:

```
DELETE /repayment_notes/:note_id/
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 204 No Content

```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    message: `Something went wrong while deleting payment note.`,
    error: err.message,
}

```

## Testing

To run tests and for coverage analysis execute `npm test`.
Ensure Docker is running. These commands integrate seamlessly into your development workflow, ensuring code reliability and overall application quality.

[⬆ Go Up ⬆](#content)
