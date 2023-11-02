# Data Modeling

### Content

- [Technology](#technology)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
  - [Users](#1-users)
  - [Clients](#2-clients)
  - [LoanApplications](#3-loanapplications)
  - [Documents](#4-documents)
  - [LoanTypes_LoanApplications](#5-loantypes_loanapplications)
  - [LoanTypes](#6-loantypes)
  - [RepaymentSchedules](#7-repaymentschedules)
  - [PaymentNotes](#8-paymentnotes)
  - [MaximumLoanAmounts](#9-maximumloanamounts)
- [Enumeration](#enumeration)
  - [User roles](#1-user-roles)
  - [Document types](#2-document-types)
  - [Loan types](#3-loan-types)
- [Relationships](#relationships)

## Technology

- Database - PostgreSQL

## Entity Relationship Diagram

![data-modeling](DataModelPG.png)

## Tables

### 1. Users

Table for authentication and storing basic user info.

| Key | Column Name  | Data Type  | Description                     |
| --- | ------------ | ---------- | ------------------------------- |
| PK  | user_id      | int        | Primary key for the users table |
|     | username     | varchar    | User's login                    |
|     | password     | varchar    | User's password                 |
|     | first_name   | varchar    | User's first name               |
|     | last_name    | varchar    | User's last name                |
|     | email        | varchar    | User's email                    |
|     | phone_number | varchar    | User's phone number             |
|     | role         | roles_enum | Role of the user.               |

### 2. Clients

Information about clients.

| Key | Column Name  | Data Type | Description                       |
| --- | ------------ | --------- | --------------------------------- |
| PK  | client_id    | int       | Primary key for the clients table |
| FK  | user_id      | int       | Foreign key from the users table  |
|     | name         | varchar   | Client's name                     |
|     | credit_story | boolean   | Does a client has a credit story  |
|     | salary       | int       | Client's salary                   |

### 3. LoanApplications

Loan application details.

| Key | Column Name         | Data Type | Description                            |
| --- | ------------------- | --------- | -------------------------------------- |
| PK  | application_id      | int       | Primary key for the applications table |
| FK  | client_id           | int       | Foreign key from the clients table     |
|     | desired_loan_amount | int       | Desired loan amount by the client      |
|     | application_date    | date      | The application's creation date.       |
|     | is_approved         | boolean   | Loan approvement (false default).      |

### 4. Documents

Details of documents associated with loan application.

| Key | Column Name    | Data Type | Description                                 |
| --- | -------------- | --------- | ------------------------------------------- |
| PK  | document_id    | int       | Primary key for the documents table         |
| FK  | application_id | int       | Foreign key from the loan application table |
|     | document_name  | varchar   | Name of the document                        |
|     | document_type  | docs_enam | Type of the document                        |

### 5. LoanTypes_LoanApplications

Loan types assosiated with loan applications.

| Key | Column Name    | Data Type | Description                                          |
| --- | -------------- | --------- | ---------------------------------------------------- |
| PK  | id             | int       | Primary key for the loantypes_loanapplications table |
| FK  | loan_type_id   | int       | Foreign key from the loantypes table                 |
| FK  | application_id | int       | Foreign key from the applications table              |

### 6. LoanTypes

Different types of loans available.

| Key | Column Name   | Data Type  | Description                           |
| --- | ------------- | ---------- | ------------------------------------- |
| PK  | loan_type_id  | int        | Primary key for the loantypes table   |
|     | loan_type     | loans_enum | Type of loan                          |
|     | interest_rate | float      | Interest rate for the loan type       |
|     | loan_term     | int        | Term/duration of the loan (in months) |
|     | required_doc  | docs_enum  | Type of doc required for loan type    |

### 7. RepaymentSchedules

Schedule of repayments for loans.

| Key | Column Name           | Data Type | Description                                  |
| --- | --------------------- | --------- | -------------------------------------------- |
| PK  | repayment_schedule_id | int       | Primary key for the repaymentschedules table |
| FK  | application_id        | int       | Foreign key from the applications table      |
|     | monthly_payment       | float     | Amount to be paid monthly                    |
|     | remaining_balance     | float     | Remaining balance to be paid                 |

### 8. PaymentNotes

Notes related to payments.

| Key | Column Name           | Data Type | Description                                   |
| --- | --------------------- | --------- | --------------------------------------------- |
| PK  | note_id               | int       | Primary key for the paymentnotes table        |
| FK  | repayment_schedule_id | int       | Foreign key from the repaymentschedules table |
|     | payment_date          | date      | Date of the payment                           |
|     | payment_amount        | float     | Amount paid                                   |

### 9. MaximumLoanAmounts

Maximum loan amounts for applications.

| Key | Column Name           | Data Type | Description                                           |
| --- | --------------------- | --------- | ----------------------------------------------------- |
| PK  | max_loan_amount_id    | int       | Primary key for the maximumloanamounts table          |
| FK  | application_id        | int       | Foreign key from the applications table               |
|     | max_loan_amount       | int       | Maximum loan amount available for the application     |
|     | total_interest_amount | float     | Total interest amount for the loan                    |
| FK  | laon_app_loan_type    | int       | Foreign key from the LoanTypes_LoanApplications table |

## Enumeration

### 1. User roles

| roles_enum |
| ---------- |
| client     |
| worker     |
| admin      |

### 2. Document types

| docs_enum            |
| -------------------- |
| passport             |
| student_verification |
| business_plan        |
| purchase_agreement   |

### 3. Loan types

| loans_enum    |
| ------------- |
| personal_loan |
| mortgage      |
| student_loan  |
| business_loan |

## Relationships

The relationships between the tables are:

- Users to Clients: One User can be associated with one Client (one-to-one) through Clients(user_id).
- Clients to LoanApplications: One Client can have multiple Applications (one-to-many) through LoanApplications(client_id).
- LoanTypes to LoanApplications: One LoanType can be associated with multiple LoanApplications and one LoanApplication can be associated with multiple LoanTypes (many-to-many) through LoanTypes_LoanApplications table.
- LoanTypes_LoanApplications to MaximumLoanAmounts: One id can be associated with one MaximumLoanAmounts (one-to-one) through MaximumLoanAmounts (loan_app_loan_type).
- LoanApplications to Documents: One LoanApplication can have multiple Documents (one-to-many) through Documents(application_id).
- LoanApplications to RepaymentSchedules: One LoanApplication can have many RepaymentSchedules (one-to-many) through RepaymentSchedules(application_id).
- LoanApplications to MaximumLoanAmounts: One LoanApplication can have multiple MaximumLoanAmount (one-to-many) through MaximumLoanAmounts(application_id).
- RepaymentSchedules to PaymentNotes: One RepaymentSchedule can have multiple PaymentNotes (one-to-many) through PaymentNotes(repayment_schedule_id).
