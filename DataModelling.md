# Data Modeling

### Content

- [Technology](#technology)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
  - [Users](#1-users)
  - [Clients](#2-clients)
  - [Workers](#3-workers)
  - [Admin](#4-admin)
  - [Documents](#5-documents)
  - [Applications](#6-applications)
  - [LoanTypes](#7-loantypes)
  - [RepaymentSchedules](#8-repaymentschedules)
  - [PaymentNotes](#9-paymentnotes)
  - [MaximumLoanAmounts](#10-maximumloanamounts)
- [Relationships](#relationships)

## Technology

- Database - PostgreSQL

## Entity Relationship Diagram

![data-modeling](YourDataModelingImageLink.png)

## Tables

### 1. Users

Table for authentication and storing basic user info.

| Key | Column Name  | Data Type | Description                            |
| --- | ------------ | --------- | -------------------------------------- |
| PK  | user_id      | int       | Primary key for the users table        |
|     | email        | varchar   | User's email                           |
|     | phone_number | int       | User's phone number                    |
|     | role         | varchar   | Role of the user (Client/Worker/Admin) |

### 2. Clients

Information about clients.

| Key | Column Name | Data Type | Description                       |
| --- | ----------- | --------- | --------------------------------- |
| PK  | client_id   | int       | Primary key for the clients table |
| FK  | user_id     | int       | Foreign key from the users table  |
|     | name        | varchar   | Client's name                     |
|     | salary      | int       | Client's salary                   |

### 3. Workers

Information about workers.

| Key | Column Name | Data Type | Description                       |
| --- | ----------- | --------- | --------------------------------- |
| PK  | worker_id   | int       | Primary key for the workers table |
| FK  | user_id     | int       | Foreign key from the users table  |
|     | name        | varchar   | Worker's name                     |

### 4. Admin

Information about admins.

| Key | Column Name | Data Type | Description                      |
| --- | ----------- | --------- | -------------------------------- |
| PK  | admin_id    | int       | Primary key for the admin table  |
| FK  | user_id     | int       | Foreign key from the users table |
|     | name        | varchar   | Admin's name                     |

### 5. Documents

Details of documents associated with clients.

| Key | Column Name   | Data Type | Description                                   |
| --- | ------------- | --------- | --------------------------------------------- |
| PK  | document_id   | int       | Primary key for the documents table           |
| FK  | client_id     | int       | Foreign key from the clients table            |
|     | document_name | varchar   | Name of the document                          |
|     | document_type | varchar   | Type of the document (e.g., ID, utility bill) |

### 6. Applications

Loan application details.

| Key | Column Name         | Data Type | Description                            |
| --- | ------------------- | --------- | -------------------------------------- |
| PK  | application_id      | int       | Primary key for the applications table |
| FK  | client_id           | int       | Foreign key from the clients table     |
| FK  | worker_id           | int       | Foreign key from the workers table     |
| FK  | loan_type_id        | int       | Foreign key from the loantypes table   |
|     | desired_loan_amount | int       | Desired loan amount by the client      |

### 7. LoanTypes

Different types of loans available.

| Key | Column Name   | Data Type | Description                                    |
| --- | ------------- | --------- | ---------------------------------------------- |
| PK  | loan_type_id  | int       | Primary key for the loantypes table            |
| FK  | admin_id      | int       | Foreign key from the admin table               |
|     | interest_rate | float     | Interest rate for the loan type                |
|     | loan_term     | int       | Term/duration of the loan (in months or years) |

### 8. RepaymentSchedules

Schedule of repayments for loans.

| Key | Column Name           | Data Type | Description                                  |
| --- | --------------------- | --------- | -------------------------------------------- |
| PK  | repayment_schedule_id | int       | Primary key for the repaymentschedules table |
| FK  | application_id        | int       | Foreign key from the applications table      |
|     | monthly_payment       | int       | Amount to be paid monthly                    |
|     | remaining_balance     | int       | Remaining balance to be paid                 |

### 9. PaymentNotes

Notes related to payments.

| Key | Column Name           | Data Type | Description                                   |
| --- | --------------------- | --------- | --------------------------------------------- |
| PK  | note_id               | int       | Primary key for the paymentnotes table        |
| FK  | repayment_schedule_id | int       | Foreign key from the repaymentschedules table |
|     | payment_date          | date      | Date of the payment                           |
|     | payment_amount        | int       | Amount paid                                   |

### 10. MaximumLoanAmounts

Maximum loan amounts for applications.

| Key | Column Name           | Data Type | Description                                       |
| --- | --------------------- | --------- | ------------------------------------------------- |
| PK  | max_loan_amount_id    | int       | Primary key for the maximumloanamounts table      |
| FK  | application_id        | int       | Foreign key from the applications table           |
|     | max_loan_amount       | int       | Maximum loan amount available for the application |
|     | total_interest_amount | int       | Total interest amount for the loan                |

## Relationships

To be filled with the specific relationships between tables and any additional details or constraints.
