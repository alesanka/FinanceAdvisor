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
  - [Endpoint /applications](#endpoints-applications)
  - [Endpoint /application/{application_id}/loan-information](#endpoints-applications-details)

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

'User was registered successfully'

```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'Password should be at least 8 characters long'
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   "error": err.message
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
    "accessToken": "9db102b9fe208ddc4bb16c67e487c3068446c085505bddd6e4e65227ee260290",
    "accessTokenExpiresAt": "2023-10-28T18:21:48.414Z",
    "refreshToken": "b54442e512075cd68721e9c0796f75ab9db3554be4153ee8ab1a698f23ca45b2",
    "refreshTokenExpiresAt": "2023-11-11T17:21:48.414Z",
    "scope": true,
    "client": {
        "id": "this-client-id-is-for-demo-only",
        "secret": "this-secret-id-is-for-demo-only",
        "grants": [
            "password"
        ]
    },
    "user": {
        "id": 2,
        "username": "maria"
    }
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: text/html; charset=utf-8

'Password is incorrect'

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
    "accessToken": "6361f33a3ad018fe3daba62c08e3522e246462669c838bd98d480a61fba6f109",
    "accessTokenExpiresAt": "2023-10-28T19:59:30.882Z",
    "refreshToken": "3696d5287a75b80601c763b2e738a68b4dab794e6dd187518a431f1b27cd58c5",
    "refreshTokenExpiresAt": "2023-11-11T18:59:30.882Z",
    "client": {
        "id": "this-client-id-is-for-demo-only",
        "secret": "this-secret-id-is-for-demo-only",
        "grants": [
            "password",
            "refresh_token"
        ]
    },
    "user": 2
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
   "error": err.message
}
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
(only admin can do this, so admin_id in body request is required)

Request:

```
PUT /api/loan_types/:loanTypeId
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "admin_id": 2,
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

## Endpoint /applications <a name="endpoints-applications"></a> [(Back to content)](#content)

**Create a new loan application.**
(only bank worker can do this)

Request:

```
POST /applications
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "client_id": 4,
  "worker_id": 6,
  "desired_loan_amount": 20000,
  "loan_type_id": 3
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "application_id": 3,
  "client_id": 4,
  "worker_id": 6,
  "desired_loan_amount": 20000,
  "loan_type_id": 3
}
```

---

**Retrieve a list of all loan applications.**
(only bank worker can do this)

Request:

```
GET /applications
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "application_id": 1,
    "client_id": 3,
    "worker_id": 5,
    "desired_loan_amount": 10000,
    "loan_type_id": 2
  },
  {
    "application_id": 2,
    "client_id": 4,
    "worker_id": 6,
    "desired_loan_amount": 15000,
    "loan_type_id": 1
  }
  // ... more credit loan applications
]
```

---

**Retrieve information about a specific loan application.**
(only bank worker can do this)

Query Parameters:

| Parameter        | Type   | Description                        |
| ---------------- | ------ | ---------------------------------- |
| `application_id` | number | Filter loan types by loan_type_id. |

Request:

```
GET /applications/:application_id
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "application_id": {application_id},
  "client_id": 3,
  "worker_id": 5,
  "desired_loan_amount": 10000,
  "loan_type_id": 2
}
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Invalid application id"
}
```

## Endpoint /application/{application_id}/loan-information <a name="endpoints-applications-details"></a> [(Back to content)](#content)

**Get information about loan details on a specific application.**

Request:

```
GET /applications/1/details
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "application_id": 1,
  "max_loan_amount": {
    "max_loan_amount_id": 456,
    "max_loan_amount": 20000,
    "total_interest_amount": 3000
  },
  "repayment_schedule": {
    "repayment_schedule_id": 789,
    "monthly_payment": 1000,
    "remaining_balance": 7000
  },
  "payment_notes": [
    {
      "note_id": 1,
      "payment_date": "2023-10-01",
      "payment_amount": 1000
    },
    {
      "note_id": 2,
      "payment_date": "2023-11-01",
      "payment_amount": 1000
    }
    // ... more payment notes
  ]
}
```

[⬆ Go Up ⬆](#content)
