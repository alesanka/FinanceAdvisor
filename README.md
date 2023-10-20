# API Documentation for Personal Finance Advisor

## Description

The Personal Finance Advisor API is a web service that provides functionality for managing user financial data and loan applications. The API allows access to user, client, administrator, and bank worker data, as well as the ability to create and manage loan applications and loan types. The API also provides information on maximum loan amounts, repayment schedules, and payment notes.

## Content: <a name="content"></a>

- [Implementation details](#imp-details)
- [Technical requirements](#tech-details)
- [Endpoints](#endpoints)
  - [Endpoint /login](#endpoints-login)
  - [Endpoint /user](#endpoints-users)
  - [Endpoint /loan-types](#endpoints-loan-types)
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
- (Database - MySQL)????
- Use 18.18.1 LTS version of Node.js
- Docker container

## Endpoints <a name="endpoints"></a>

### Endpoint /login <a name="endpoints-login"></a> [(Back to content)](#content)

**Register a new user account.**

Request:

```
POST /register
Content-Type: application/json
Request Body:
{
  "login": "user-shmyser",
  "password": "securepassword123"
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "success": true
  "message": "User registration is successful."
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
   "success": false,
   "message": "Password should be at least 8 characters long"
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
   "success": false,
   "message": "Server error"
}
```

## Endpoint /users <a name="endpoints-users"></a> [(Back to content)](#content)

**Create a new user account.**

Request:

```
POST /users HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "user_id": 3,
  "email": "newuser@example.com",
  "phone_number": "+9876543210",
  "role": "worker"
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Email address 'newuser@example.com' is already registered."
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Internal server error occurred. Please try again later or contact support."
}
```

---

**Retrieve the users profile information.**

Request:

```
GET /users HTTP/1.1
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
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "user_id":{user_id},
    "email": "user1@example.com",
    "phone_number": "+1234567890",
    "role": "client"
  }
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Invalid user's id"
}
```

---

**Retrieve a list of users with optional query parameters for filtering and sorting.**

Query Parameters:

| Parameter   | Type   | Description                                                |
| ----------- | ------ | ---------------------------------------------------------- |
| `role`      | string | Filter users by role (e.g., "client").                     |
| `client_id` | number | Filter users by client_id.                                 |
| `salary`    | number | Filter users by salary (e.g., "5000").                     |
| `name`      | string | Filter users by name (e.g., "client").                     |
| `sort`      | string | Filter users by different parameters (e.g., name, salary). |

Request:

```
GET /users?role=client&sort=salary HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "user_id": 1,
    "name": Name Name,
    "salary": 7000,
    "role": "client"
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

Request:

```
PUT /users/:userId HTTP/1.1
Content-Type: application/json

{
  "phone_number": "+9999999999"
}
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "user_id": {userId},
  "email": "user1@example.com",
  "phone_number": "+9999999999",
  "role": "client"
}
```

---

**Delete a user account.**

Request:

```
DELETE /users/:user_id HTTP/1.1
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

## Endpoint /loan-types <a name="endpoints-loan-types"></a> [(Back to content)](#content)

**Create a new type of loan.**
(only admin can do this)

Request:

```
POST /api/loan-types
Content-Type: application/json

{
  "admin_id": 4,
  "loan_type": "personal loan",
  "interest_rate": 6.0,
  "loan_term": 36
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "loan_type_id": 3,
  "admin_id": 4,
  "loan_type": "personal loan",
  "interest_rate": 6.0,
  "loan_term": 36
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Type of loan is already exists."
}
```

or

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Internal server error occurred. Please try again later or contact support."
}
```

---

**Retrieve the information about existing loan types.**
(only admin can do this)

Request:

```
GET /loan-types HTTP/1.1
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

| Parameter      | Type   | Description                        |
| -------------- | ------ | ---------------------------------- |
| `loan_type_id` | number | Filter loan types by loan_type_id. |
| `loan_type`    | string | Filter by loan types.              |

Request:

```
GET /loan-types/:loan_type_id
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_type_id": {loan_type_id},
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
PUT /api/loan-types/:loanTypeId

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

---

**Delete a loan type.**
(only admin can do this)

Request:

```
DELETE /loan-types/:loan_type_id
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

## Endpoint /applications <a name="endpoints-applications"></a> [(Back to content)](#content)

**Create a new loan application.**
(only bank worker can do this)

Request:

```
POST /applications
Content-Type: application/json

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
