# API Documentation for Personal Finance Advisor

## Description

The Personal Finance Advisor API is a web service that provides functionality for managing user financial data and loan applications. The API allows access to user's (which can be a client, a bank worker or an administrator) data, as well as the ability to create and manage loan applications. An administator can create different loan types for calculating loan details. The API also provides information on maximum loan amounts, repayment schedules, and payment notes.

## Content: <a name="content"></a>

- [Implementation details](#imp-details)
- [Technical requirements](#tech-details)
- [Endpoints](#endpoints)
  - [Endpoint /register](#endpoints-register)
  - [Endpoint /login](#endpoints-login)
  - [Endpoint /user](#endpoints-users)
  - [Endpoint /loan_types](#endpoints-loan-types)
  - [Endpoint /documents](#endpoints-documents)
  - [Endpoint /applications](#endpoints-applications)
  - [Endpoint /application/{application_id}/max_available_amount](#endpoints-applications-details)
  - [Endpoint /application/{application_id}/approved](#endpoints-applications-approved)
  - [Endpoint /repayment_notes](#endpoints-repayment-notes)

## Implementation details <a name="imp-details"></a>

Base URL

```
http://localhost:5000/api/v1/
```

## Technical requirements <a name="tech-details"></a>

- Implementation language: JavaScript
- Framework: Express
- Database: PostgresSQL
- Use 18.18.1 LTS version of Node.js
- Docker container

## Endpoints <a name="endpoints"></a>

### Endpoint /register <a name="endpoints-register"></a> [(Back to content)](#content)

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

User was registered successfully. Id - 1

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

### Endpoint /login <a name="endpoints-login"></a> [(Back to content)](#content)

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

## Endpoint /users <a name="endpoints-users"></a> [(Back to content)](#content)

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
    "first_name": "Anna",
    "last_name": "Smith",
    "email": "user@example.com",
    "phone_number": "1234567890",
    "client_id": 1,
    "salary": 30000,
    "credit_story": false,
    "role": "client"
  }
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": err.message
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
GET /users/filter?role=admin&name=anna HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user_id": 1,
  "first_name": "Anna",
  "last_name": "Smith",
  "email": "thebestanna@email.com",
  "phone_number": "1234567890",
  "role": "admin",
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
  "error": err.message
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
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
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
  "error": err.message
}

```

## Endpoint /loan_types <a name="endpoints-loan-types"></a> [(Back to content)](#content)

**Create a new type of loan.**

\*protected request (available only for admin and worker with access_token)
\*(only admins can do this, user_id is required for checking user's role)

Request:

```
POST /api/loan_types
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

'Loan type was created successfully'

```

In case of error response:

```
HTTP/1.1 409 Conflict
Content-Type: text/html; charset=utf-8

`Loan type ${loan_type} already exists`
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
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
GET /loan_types/:loan_type_id
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
  "error": err.message
}
```

---

**Update loan type information.**

\*protected request (available only for admin and worker with access_token)
\*(only admins can do this, user_id is required for checking user's role)

Request:

```
PUT /api/loan_types/:loanTypeId
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
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'Only admin can update loan type data, so admin_id is required.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

## Endpoint /documents <a name="endpoints-documents"></a> [(Back to content)](#content)

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

'Document was added successfully'
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
  "error": err.message
}
```

**Get all documents by application id.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

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
        "application_id": {application_id},
        "document_name": "Client passport",
        "document_type": "passport"
    }
]
```

**Delete a user account.**

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
  "error": err.message
}

```

## Endpoint /applications <a name="endpoints-applications"></a> [(Back to content)](#content)

**Create a new loan application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /applications
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id: 7,
  "client_id": 4,
  "desired_loan_amount": 20000
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: text/html; charset=utf-8

'Loan application was created successfully'
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
  "error": err.message
}
```

---

**Save information about a specific loan application with a specific loan type.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

| Parameter        | Type    | Description                                        |
| ---------------- | ------- | -------------------------------------------------- |
| `application_id` | integer | The unique ID of the loan application.             |
| `loan_type_id`   | integer | The unique ID of the loan type associated with it. |

Request:

```
POST /applications/save?application_id=1&loan_type_id=1
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user_id": 7
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "maxAvailableAmount id": 1
}
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Only workers can modificate loan applications.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

## Endpoint /application/{application_id}/max_available_amount <a name="endpoints-applications-details"></a> [(Back to content)](#content)

**User can get information about all max avaibale for him amounts of loans regarding his application (if before worker created his application and connected it with desired loan types).**

\*public request

| Parameter            | Type    | Description                                                         |
| -------------------- | ------- | ------------------------------------------------------------------- |
| `max_loan_amount_id` | integer | The unique ID of the max loan amount record associated with a user. |

Request:

```
GET /application/{max_loan_amount_id}/max_available_amount
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{

    "Max available amount of loan": 549734,
    "Loan type": "personal_loan",
    "Max interest amount": "20266.13"

}
```

In case of error response:

```
HTTP/1.1 403 Forbidden
Content-Type: text/html; charset=utf-8

'Data not found for the provided max loan amount ID.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

## Endpoint /application/{application_id}/approved <a name="endpoints-applications-approved"></a> [(Back to content)](#content)

**Approve desired by client amount of credit.**

The loan application will be approved only in case if in the table MaxLoanAmount there is a corresponding value(ID) stating that the maximum available amount for this type of loan exceeds the amount desired by the client.

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Query Parameters:

| Parameter        | Type    | Description                                                 |
| ---------------- | ------- | ----------------------------------------------------------- |
| `application_id` | integer | The unique ID of the loan application.                      |
| `loan_type`      | enum    | Type of loan from enum ('personal_loan', 'mortgage', etc.). |

Request:

```
PUT /application/{application_id}/approved?loan_type=personal_loan
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

'Status changed on approved'
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'The provided loan type does not match the application data.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

## Endpoint /repayment_schedule <a name="endpoints-applications-approved"></a> [(Back to content)](#content)

**Add a repayment schedule for a specific application.**

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Query Parameters:

| Parameter        | Type    | Description                                                 |
| ---------------- | ------- | ----------------------------------------------------------- |
| `application_id` | integer | The unique ID of the loan application.                      |
| `loan_type`      | enum    | Type of loan from enum ('personal_loan', 'mortgage', etc.). |

Request:

```
POST /repayment_schedule/{application_id}/approved?loan_type=personal_loan
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "application_id": 1,
    "user_id": 2
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "repaymentSchedule": {
        "repayment_schedule_id": 1,
        "application_id": 1,
        "monthly_payment": "2824.06",
        "remaining_balance": "549734.00"
    }
}
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8

'Loan application not found.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

## Endpoint /repayment_notes <a name="endpoints-repayment-notes"></a> [(Back to content)](#content)

**Add a list of payment notes for a specific repayment schedule.**

After getting repayment_schedule_id a bank worker can create notes for client with month payment with dates of payment.

\*protected request (available only for admin and worker with access_token)
\*(only bank worker can do this, user_id is required for checking user's role)

Request:

```
POST /repayment_notes
Content-Type: application/json
Authorization: Bearer {access_token}

{
    "repayment_schedule_id": 2,
    "user_id": 2
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

'Payment notes created successfully.'
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8

'User id is required for checking role.'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": err.message
}
```

---

**Get a note with for specific date.**

Client can get note with month payment for requested date.

\*public request

Query Parameters:

| Parameter               | Type    | Required | Description                                               |
| ----------------------- | ------- | -------- | --------------------------------------------------------- |
| `repayment_schedule_id` | integer | Yes      | The unique ID of the repayment schedule.                  |
| `year`                  | integer | Yes      | The year part of the date for which to find the payment.  |
| `month`                 | integer | Yes      | The month part of the date for which to find the payment. |

Request:

```
GET /repayment_notes/note?repayment_schedule_id=2&year=2024&month=5
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
  "error": err.message
}
```

---

[⬆ Go Up ⬆](#content)
