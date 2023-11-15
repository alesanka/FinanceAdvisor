# Data Modeling

### Content

- [Technology](#technology)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
  - [Users](#1-users)
  - [Clients](#2-clients)
  - [LoanTypes](#3-loantypes)
  - [LoanApplications](#4-loanapplications)
  - [Documents](#5-documents)
  - [RepaymentSchedules](#6-repaymentschedules)
  - [PaymentNotes](#7-paymentnotes)
  - [MaximumLoanAmounts](#8-maximumloanamounts)
  - [LoanTypes_MaximumLoanAmounts](#9-loantypes_maximumloanamounts)
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

Information about clients who are also users.

| Key | Column Name  | Data Type | Description                       |
| --- | ------------ | --------- | --------------------------------- |
| PK  | client_id    | int       | Primary key for the clients table |
| FK  | user_id      | int       | Foreign key from the users table  |
|     | credit_story | boolean   | Client's credit history           |
|     | salary       | int       | Client's salary                   |

### 3. LoanTypes

Different types of loans available.

| Key | Column Name   | Data Type  | Description                           |
| --- | ------------- | ---------- | ------------------------------------- |
| PK  | loan_type_id  | int        | Primary key for the loantypes table   |
|     | loan_type     | loans_enum | Type of loan                          |
|     | interest_rate | float      | Interest rate for the loan type       |
|     | loan_term     | int        | Term/duration of the loan (in months) |
|     | required_doc  | docs_enum  | Type of document required for loan    |

### 4. LoanApplications

Loan application details.

| Key | Column Name         | Data Type | Description                                    |
| --- | ------------------- | --------- | ---------------------------------------------- |
| PK  | application_id      | int       | Primary key for the applications table         |
| FK  | id                  | int       | Foreign key from LoanType_MaxLoanAmounts table |
|     | desired_loan_amount | int       | Desired loan amount by the client              |
|     | application_date    | date      | The application's creation date.               |
|     | is_approved         | boolean   | Status of loan application approval            |

### 5. Documents

Details of documents associated with loan application.

| Key | Column Name    | Data Type | Description                                 |
| --- | -------------- | --------- | ------------------------------------------- |
| PK  | document_id    | int       | Primary key for the documents table         |
| FK  | application_id | int       | Foreign key from the loan application table |
|     | document_name  | varchar   | Name of the document                        |
|     | document_type  | doc_enum  | Type of the document                        |

### 6. RepaymentSchedules

Schedule of repayments for loans.

| Key | Column Name           | Data Type | Description                                  |
| --- | --------------------- | --------- | -------------------------------------------- |
| PK  | repayment_schedule_id | int       | Primary key for the repaymentschedules table |
| FK  | application_id        | int       | Foreign key from the applications table      |
|     | monthly_payment       | float     | Amount to be paid monthly                    |
|     | remaining_balance     | float     | Remaining balance to be paid                 |

### 7. PaymentNotes

Notes related to payments made or missed.

| Key | Column Name           | Data Type | Description                                    |
| --- | --------------------- | --------- | ---------------------------------------------- |
| PK  | note_id               | int       | Primary key for the paymentnotes table         |
| FK  | repayment_schedule_id | int       | Foreign key from the repayment schedules table |
|     | payment_date          | data      | Data of required payment                       |
|     | payment_amount        | float     | Required payment amount                        |
|     | payment_received      | boolean   | Info about recievement of payment              |

### 8. MaximumLoanAmounts

Maximum loan amounts per client based on their salary, credit history and desired loan type.

| Key | Column Name           | Data Type | Description                                               |
| --- | --------------------- | --------- | --------------------------------------------------------- |
| PK  | max_loan_amount_id    | int       | Primary key for the maximumloanamounts table              |
| FK  | client_id             | int       | Foreign key from the clients table                        |
|     | max_loan_amount       | float     | Calculated maximum amount that can be lent to the client  |
|     | total_interest_amount | float     | Calculated total interest that will be paid by the client |

### 9. LoanTypes_MaximumLoanAmounts

Relation between loan types and maximum loan amounts.

| Key | Column Name        | Data Type | Description                                            |
| --- | ------------------ | --------- | ------------------------------------------------------ |
| PK  | id                 | int       | Primary key for the loantypes_maximumloanamounts table |
| FK  | loan_type_id       | int       | Foreign key from the loantypes table                   |
| FK  | max_loan_amount_id | int       | Foreign key from the maximumloanamounts table          |

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
- Clients to MaximumLoanAmounts: One Client can have multiple MaximumLoanAmounts (one-to-many) through MaximumLoanAmounts(client_id).
- LoanTypes to MaximumLoanAmounts: One LoanType can be associated with multiple MaximumLoanAmounts and one MaximumLoanAmounts can be associated with multiple LoanTypes (many-to-many) through LoanTypes_MaximumLoanAmounts table.
- LoanTypes_MaximumLoanAmounts to LoanApplications: One LoanTypes_MaximumLoanAmounts(id) can be associated with one LoanApplications (one-to-one) through LoanApplications(id).
- LoanApplications to Documents: One LoanApplication can have multiple Documents (one-to-many) through Documents(application_id).
- LoanApplications to RepaymentSchedules: One LoanApplication can have one RepaymentSchedules (one-to-one) through RepaymentSchedules(application_id).
- RepaymentSchedules to PaymentNotes: One RepaymentSchedule can have multiple PaymentNotes (one-to-many) through PaymentNotes(repayment_schedule_id).
