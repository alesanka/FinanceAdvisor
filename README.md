# API Documentation for Personal Finance Advisor

## Description

The Personal Finance Advisor API is a web service that provides functionality for managing user financial data and loan applications. The API allows access to user, client, administrator, and bank worker data, as well as the ability to create and manage loan applications and loan types. The API also provides information on maximum loan amounts, repayment schedules, and payment notes.

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

- Task should be implemented on JavaScript
- Framework - express
- Database - Postgress
- Use 18.18.1 LTS version of Node.js
- Docker container

## Endpoints <a name="endpoints"></a>

### Endpoint /register <a name="endpoints-register"></a> [(Back to content)](#content)

**Register a new user account.**

Request:

```
POST /register
Content-Type: application/json
Request Body:
{
  "username": "anna",
  "password": "abrakadabra",
  "email": "thebestanna@email.com",
  "phone_number": "1234567890",
  "role": "admin",
  "name": "Anna Hanna",
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "message": "User registration is successful."
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
   "message": "Password should be at least 8 characters long"
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   "message": "Server error"
}
```

### Endpoint /login <a name="endpoints-login"></a> [(Back to content)](#content)

**Login an existing user.**
When a user attempts to log into the app, the system initiates a multi-step verification process.
Initially, the system checks if the provided login (username) exists in the database.
Upon successful login verification, the system compares the entered password with the stored password for that login.
If the password matches, the system proceeds to the next step. It communicates with the node-oauth2-server to obtain an access token.
Both the access token and the refresh token are securely saved in the system for future requests.
For all subsequent interactions, the user undergoes token-based authentication. The access token remains valid for 1 hour. If any request returns an error indicating that the token has expired, the user is required to initiate a token-refresh request to obtain a new access token.

Each future request must contain Authorization: Bearer {{token}}

Request:

```
POST /login
Content-Type: application/x-www-form-urlencoded
Request Body: {
        grant_type: password,
        scope: admin,
        client_id: this-client-id-is-for-demo-only,
        client_secret: this-secret-id-is-for-demo-only,
        username: alesia,
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
        "username": "daniil"
    }
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
   "error": "Invalid client: client is invalid"
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   "message": "Server error"
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
   "error": "Invalid client: client is invalid"
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   "message": "Server error"
}
```

## Endpoint /users <a name="endpoints-users"></a> [(Back to content)](#content)

**Retrieve the users profile information.**

Request:

```
GET /users HTTP/1.1
Authorization: Bearer {access_token}
```

Response:

```
[
  {
    "user_id": 1,
    "email": "user1@example.com",
    "phone_number": "+1234567890",
    "role": "client"
  },
  {
    "user_id": 2,
    "email": "user2@example.com",
    "phone_number": "+9876543210",
    "role": "worker"
  }
  // ... more users
]
```

---

**Retrieve a specific user's profile information.**

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
    "email": "user1@example.com",
    "phone_number": "1234567890",
    "role": "client"
    "name": "Name",
    "client_id": 1
  }
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Sorry, unable to get user"
}
```

---

**Retrieve a list of users with optional query parameters for filtering and sorting.**

Query Parameters:

| Parameter | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `role`    | string | Filter users by role (e.g., "client", "admin", "worker").              |
| `salary`  | number | Filter users by salary (e.g., "5000")(avaible only for role "client"). |
| `name`    | string | Filter users by name (e.g., "client").                                 |
| `email`   | string | Filter users by email (e.g., cool@email.com).                          |
| `phone`   | string | Filter users by phone (e.g., 1234567890).                              |
| `sort`    | string | Filter users by parameters name or salary(only for role "client").     |

Request:

```
GET /users/filter?role=admin&name=alesia HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
        "user_id": 4,
        "email": "somemail@email.com",
        "phone_number": "1234567890",
        "role": "admin",
        "name": "Alesia P",
        "admin_id": 1
    }
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid query parameters. Please check your request."
}
```

---

**Update user information.**
There is a possibillity to update user's email, name, phone_number, salary (if user is a client).

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
Content-Type: application/json
{
  message: `User ${userId} data updated successfully.`
 }
```

In case of error response:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "Server error while updating user data."
}
```

---

**Delete a user account.**

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
  "error": "Internal server error occurred. Please try again later or contact support."
}

```

## Endpoint /loan_types <a name="endpoints-loan-types"></a> [(Back to content)](#content)

**Create a new type of loan.**
(only admin can do this)

Request:

```
POST /api/loan_types
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "admin_id": 4,
  "loan_type": "personal_loan",
  "interest_rate": 6,
  "loan_term": 36
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  message: 'Loan type was created successfully'
 }

```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  'Invalid loan type. Accepted values are: personal_loan, mortgage, student_loan, business_loan'
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  `Server error while creation loan type: ${err}`
}
```

---

**Retrieve the information about existing loan types.**

Request:

```
GET /loan_types HTTP/1.1
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "loan_type_id": 1,
    "admin_id": 3,
    "loan_type": "personal loan",
    "interest_rate": 5.5,
    "loan_term": 12
  },
  {
    "loan_type_id": 2,
    "admin_id": 4,
    "loan_type": "auto loan",
    "interest_rate": 4.8,
    "loan_term": 24
  }
  // ... more loan types
]
```

---

**Retrieve a specific loan type information.**
(only admin can do this)

Query Parameters:

| Parameter      | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| `loan_type_id` | number | Get loan type by loan_type_id. |
| `loan_type`    | string | Get loan type by loan_type.    |

Request:

```
GET /loan_types/:loan_type_id
Content-Type: application/json
Authorization: Bearer {access_token}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_type_id": {loan_type_id},
  "loan_type": "personal_type",
  "admin_id": 3,
  "interest_rate": 5.5,
  "loan_term": 12
}
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Invalid loan's type id"
}
```

---

**Update loan type information.**
(only admin can do this)

Request:

```
PUT /api/loan_types/:loanTypeId
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "interest_rate": 5.2
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_type_id": 1,
  "admin_id": 3,
  "interest_rate": 5.2,
  "loan_term": 12
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
