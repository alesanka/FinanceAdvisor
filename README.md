# API Documentation for Personal Finance Advisor

## Description <a name="go-up"></a>

The Personal Finance Advisor API is a web service that provides functionality for managing user financial data and loan applications. The API allows access to user, client, administrator, and bank worker data, as well as the ability to create and manage loan applications and loan types. The API also provides information on maximum loan amounts, repayment schedules, and payment notes.

## Content:

- [Implementation details](##implementation-details)
- [Technical requirements](##technical-requirements)
- [Endpoints](#endpoints)
  - [Endpoint /api/v1/login](#endpoint-apiv1login)
  - [Endpoint /api/v1/user](#endpoint-apiv1users)
  - [Endpoint /api/v1/loan-types](#endpoint-apiv1loan-types)
  - [Endpoint /api/v1/user/{user_id}/loan](#endpoint-apiuseruser_idloan)

## Implementation details

Base URL

```
http://localhost:5000/api/v1/
```

## Technical requirements

- Task should be implemented on JavaScript
- Framework - express
- (Database - MySQL)????
- Use 18.18.1 LTS version of Node.js
- (Docker)????

## Endpoints

### Endpoint /api/v1/login

**Register a new user account.**

Request:

```
POST /api/v1/register
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
  "message": "User registration is successful."
}
```

### Endpoint /api/v1/users

**Create a new user account.**

Request:

```
POST /api/v1/users HTTP/1.1
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
GET /api/v1/users HTTP/1.1
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
GET /api/v1/users/:user_id
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
GET /api/v1/users?role=client&sort=salary HTTP/1.1
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
PUT /api/v1/users/:userId HTTP/1.1
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
DELETE /api/v1/users/:user_id HTTP/1.1
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

### Endpoint /api/v1/loan-types

**Create a new type of loan.**
**(only admin can do this)**

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
**(only admin can do this)**

Request:

```
GET /api/v1/loan-types HTTP/1.1
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
**(only admin can do this)**

Request:

```
GET /api/v1/loan-types/:loan_type_id
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
**(only admin can do this)**

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
**(only admin can do this)**

Request:

```
DELETE /api/v1/loan-types/:loan_type_id
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

### Endpoint /api/v1/loan_types

**Create a new loan type.**

Request:

```
POST /api/v1/loan_types HTTP/1.1
Content-Type: application/json

{
    "loan_type": "Personal Loan 1-year",
    "interest_rate": 12,
    "loan_term": 12
  }
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "loan_type_id": 1,
    "loan_type": "Personal Loan 1-year",
    "interest_rate": 12,
    "loan_term": 12
  }
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Loan type is already exists."
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

**Retrieve the information about existing types of loans.**

Request:

```
GET /api/v1/loan_types HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "loan_type_id": 1,
    "loan_type": "Personal Loan 1-year",
    "interest_rate": 12,
    "loan_term": 12
  },
  {
    "loan_type_id": 2,
    "loan_type": "Personal Loan 3-year",
    "interest_rate": 10,
    "loan_term": 36
  },
  {
    "loan_type_id": 3,
    "loan_type": "Mortgage Loan",
    "interest_rate": 4,
    "loan_term": 180
  },
  {
    "loan_type_id": 4,
    "loan_type": "Auto Loan",
    "interest_rate": 6,
    "loan_term": 60
  },
  {
    "loan_type_id": 5,
    "loan_type": "Business Loan",
    "interest_rate": 1.5,
    "loan_term": 60
  }
]

```

---

**Retrieve information about a specific type of loan.**

Request:

```
GET /api/v1/groups/:loan_type_id
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "loan_type_id": {loan_type_id},
    "loan_type": "Personal Loan 1-year",
    "interest_rate": 12,
    "loan_term": 12
  }
```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Invalid group's id"
}
```

---

**Delete a type of loan.**

Request:

```
DELETE /api/v1/loan_types/:loan_type_id HTTP/1.1
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

### Endpoint /api/v1/max_loans

**Create information about maximum loan available for user.**

Request:

```
POST /api/v1/max_loans HTTP/1.1
Content-Type: application/json

{
    "user_id": 1,
    "loan_type": "Personal Loan 1-year",
    "salary": 10000,
    "loan_term": 12,
    "interest_rate": 12,
  }
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "user_id": 1,
    "max_available_amount_of_loan": 68000,
    "loan_type": "Personal Loan 1-year",
    "loan_term": 12
  }
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "User's salary is requered."
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

**Retrieve the information about maximal loans available for user.**

Query Parameters:

| Parameter | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `sort`    | string | Sort users by a specific field (e.g., "max_available_amount_of_loan"). |
| `user_id` | number | Filter users by ID.                                                    |

Request:

```
GET /api/v1/max_loans?user_id=1 HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "max_loan_id": 1,
    "user_id": 1,
    "max_available_amount_of_loan": 68000,
    "loan_type": "Personal Loan 1-year",
    "loan_term": 12
  },
  {
    "max_loan_id": 2,
    "user_id": 1,
    "max_available_amount_of_loan": 279000,
    "loan_type": "Personal Loan 3-year",
    "loan_term": 36
  },
  {
    "max_loan_id": 3,
    "user_id": 1,
    "max_available_amount_of_loan": 1012000,
    "loan_type": "Mortgage Loan",
    "loan_term": 180
  },
  {
    "max_loan_id": 4,
    "user_id": 1,
    "max_available_amount_of_loan": 541000,
    "loan_type": "Auto Loan",
    "loan_term": 60
  },
  {
    "max_loan_id": 5,
    "user_id": 1,
    "max_available_amount_of_loan": 663000,
    "loan_type": "Business Loan",
    "loan_term": 60
  }
]
```

### Endpoint /api/v1/loans

**Create information about new loan.**

Request:

```
POST /api/v1/loans HTTP/1.1
Content-Type: application/json

{
  "user_id": 1,
  "max_available_amount_of_loan": 68000,
  "loan_type": "Personal Loan 1-year",
  "loan_term": 12,
  "requested_loan_amount": 40000
}

```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "loan_id": 1,
    "user_id": 1,
    "loan_amount": 40000,
    "loan_term": 12,
    "total_interest": 3479,
    "month_payment": 15948
  }
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Requested loan amount is larger than maximal available loan amount."
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

**Retrieve loan information.**

Quary parameters:

| Parameter     | Type    | Description                |
| ------------- | ------- | -------------------------- |
| `loan_amount` | number  | The principal loan amount. |
| `loan_id`     | number  | The loan ID.               |
| `loan_term`   | integer | The loan term in months.   |
| `user_id`     | number  | The loan of user.          |

Request:

```
GET /api/v1/loans?user_id=1&loan_term=12 HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_id": 1,
  "user_id": 1,
  "loan_amount": 40000,
  "loan_term": 12,
  "total_interest": 3479,
  "month_payment": 15948
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

or

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "The requested loan was not found."
}
```

---

**Cancel a loan application.**

Request:

```
DELETE /api/v1/loans/:loan_id HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 204 No Content
```

[⬆ Go Up ⬆](#go-up)
