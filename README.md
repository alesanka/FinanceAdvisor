# API Documentation for Personal Finance Advisor

## Description <a name="go-up"></a>

The Financial Advisor API provides users with the functionality to save their personal data, including details such as name, email, salary, and social group. Users can also specify their desired loan amount and loan term, and the system will provide them with available loan options, including types of loans and the maximum loan amounts they can obtain. If users agree to the loan terms, they can save information about approved loans, which will be taken into consideration in future loan requests.

## Content:

- [Implementation details](##implementation-details)
- [Technical requirements](##technical-requirements)
- [Endpoints](#endpoints)
  - [Endpoint /api/v1/register](#endpoint-apiregister)
  - [Endpoint /api/v1/user](#endpoint-apiuser)
  - [Endpoint /api/v1/loan](#endpoint-apiloan)
  - [Endpoint /api/v1/user/{user_id}/loan](#endpoint-apiuseruser_idloan)

## Implementation details

Base URL

```
http://localhost:8000/api/v1/
```

## Technical requirements

- Task should be implemented on JavaScript
- Framework - express
  (- Database - MySQL)????
- Use 18.18.1 LTS version of Node.js
  (- Docker)????

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
Content-Type: application/json

{
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "100000"
}
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "1",
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "100000"
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Email address 'edmundhillary@example.com' is already registered."
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
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1",
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "100000"
}
```

---

**Retrieve a specific user's profile information.**

Request:

```
GET /api/v1/users/:user_id
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1",
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "100000"
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

| Parameter      | Type   | Description                                                                  |
| -------------- | ------ | ---------------------------------------------------------------------------- |
| `sort`         | string | Sort users by a specific field (e.g., "name," "salary").                     |
| `name`         | string | Filter users by name (e.g., "Edmund Hillary").                               |
| `social_group` | string | Filter users by their social group (e.g., "student", "employee", "retiree"). |
| `salary`       | number | Filter users by their salary.                                                |

Request:

```
GET /api/v1/users?social_group="employee"&sort=salary HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
    "id": "2",
    "name": "Tenzing Norgay",
    "email": "tenzingnorgay@example.com",
    "social_group": "employee",
    "salary": "50000"
  },
  {
    "id": "1",
    "name": "Edmund Hillary",
    "email": "edmundhillary@example.com",
    "social_group": "employee",
    "salary": "100000"
  },
  // Additional user objects...
]

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

### Endpoint /api/v1/loan

Calculate and request a new loan.

Request:

```
POST /api/v1/loan HTTP/1.1
Content-Type: application/json

{
  "principal_amount": 5000,
  "interest_rate": 5.5,
  "loan_term_months": 24,
  "currency": "USD"
}

```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "loan_id": 1,
  "loan_amount": 5000,
  "monthly_payment": 221.27,
  "total_interest_paid": 114.48,
  "status": "approved"
}
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid loan parameters. Please check your input."
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

Retrieve loan information.

Quary parameters:

| Parameter             | Type    | Description                                                        |
| --------------------- | ------- | ------------------------------------------------------------------ |
| `principal_amount`    | number  | The principal loan amount.                                         |
| `interest_rate`       | number  | The annual interest rate as a percentage.                          |
| `loan_term_months`    | integer | The loan term in months.                                           |
| `currency`            | string  | The currency in which the loan is requested.                       |
| `loan_id`             | string  | The unique identifier of the loan application to retrieve details. |
| `loan_amount`         | number  | The approved loan amount.                                          |
| `status`              | string  | The status of the loan.                                            |
| `monthly_payment`     | number  | The monthly repayment amount.                                      |
| `total_interest_paid` | number  | The total interest paid over the loan term.                        |

Request:

```
GET /api/v1/loan?status=approved HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "loan_id": "1",
  "loan_amount": 5000,
  "monthly_payment": 221.27,
  "total_interest_paid": 114.48,
  "status": "approved"
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

Cancel a loan application.

Request:

```
DELETE /api/v1/loan/1 HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 204 No Content
```

### Endpoint /api/v1/user/{user_id}/loan

Retrieve a list of loans associated with a specific user.

Request:

```
GET /api/v1/user/1/loans HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "loan_id": "1",
    "loan_amount": 5000,
    "monthly_payment": 221.27,
    "total_interest_paid": 114.48,
    "status": "approved"
  },
  {
    "loan_id": "2",
    "loan_amount": 7500,
    "monthly_payment": 331.91,
    "total_interest_paid": 171.72,
    "status": "rejected"
  }
]

```

In case of error response:

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "User with ID 1 or their loans were not found."
}

```

[⬆ Go Up ⬆](#go-up)
