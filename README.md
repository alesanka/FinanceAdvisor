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
  "salary": "10000"
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
  "salary": "10000"
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
  "id": 1,
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "10000"
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
  "id": {user_id},
  "name": "Edmund Hillary",
  "email": "edmundhillary@example.com",
  "social_group": "employee",
  "salary": "10000"
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
    "id": 2,
    "name": "Tenzing Norgay",
    "email": "tenzingnorgay@example.com",
    "social_group": "employee",
    "salary": "5000"
  },
  {
    "id": 1,
    "name": "Edmund Hillary",
    "email": "edmundhillary@example.com",
    "social_group": "employee",
    "salary": "10000"
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

### Endpoint /api/v1/groups

**Create a new social group.**

Request:

```
POST /api/v1/groups HTTP/1.1
Content-Type: application/json

{
    "social_group": "employeee",
    "available_types_of_loans": [
      "Personal Loan 1-year",
      "Personal Loan 3-year",
      "Mortgage Loan",
      "Auto Loan",
      "Student Loan",
      "Business Loan"
    ]
  }
```

In case of successful response:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "group_id": 1,
    "social_group": "employeee",
    "available_types_of_loans": [
      "Personal Loan 1-year",
      "Personal Loan 3-year",
      "Mortgage Loan",
      "Auto Loan",
      "Student Loan",
      "Business Loan"
    ]
  }
```

In case of error response:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Social group is already exists."
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

**Retrieve the information about existing social groups.**

Request:

```
GET /api/v1/groups HTTP/1.1
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "group_id": 1,
    "social_group": "employeee",
    "available_types_of_loans": [
      "Personal Loan 1-year",
      "Personal Loan 3-year",
      "Mortgage Loan",
      "Auto Loan",
      "Student Loan",
      "Business Loan"
    ]
  },
  {
    "group_id": 2,
    "social_group": "student",
    "available_types_of_loans": ["Personal Loan 1-year", "Student Loan"]
  },
  {
    "group_id": 3,
    "social_group": "retiree",
    "available_types_of_loans": [
      "Personal Loan 1-year",
      "Personal Loan 3-year",
      "Auto Loan",
      "Business Loan"
    ]
  }
]
```

---

**Retrieve a specific social group information.**

Request:

```
GET /api/v1/groups/:group_id
```

In case of successful response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "group_id": {group_id},
    "social_group": "employeee",
    "available_types_of_loans": [
      "Personal Loan 1-year",
      "Personal Loan 3-year",
      "Mortgage Loan",
      "Auto Loan",
      "Student Loan",
      "Business Loan"
    ]
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

**Delete a group.**

Request:

```
DELETE /api/v1/groups/:group_id HTTP/1.1
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
