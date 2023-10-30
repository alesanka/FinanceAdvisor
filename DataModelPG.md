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

![data-modeling](DataModelPG.png)

## Tables

### 1. Users

Table for authentication and storing basic user info.

| Key | Column Name  | Data Type  | Description                     |
| --- | ------------ | ---------- | ------------------------------- |
| PK  | user_id      | int        | Primary key for the users table |
|     | email        | varchar    | User's email                    |
|     | phone_number | int        | User's phone number             |
|     | role         | roles_enam | Role of the user.               |

### 2. Clients

Information about clients.

| Key | Column Name  | Data Type | Description                                  |
| --- | ------------ | --------- | -------------------------------------------- |
| PK  | client_id    | int       | Primary key for the clients table            |
| FK  | user_id      | int       | Foreign key from the users table             |
|     | name         | varchar   | Client's name                                |
|     | salary       | int       | Client's salary                              |
|     | attached_doc | boolean   | Checking if the client attached any document |

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

| Key | Column Name   | Data Type | Description                         |
| --- | ------------- | --------- | ----------------------------------- |
| PK  | document_id   | int       | Primary key for the documents table |
| FK  | client_id     | int       | Foreign key from the clients table  |
|     | document_name | varchar   | Name of the document                |
|     | document_type | doc_enam  | Type of the document                |

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
|     | loan_type     | loan_enum | Type of loan                                   |
|     | interest_rate | float     | Interest rate for the loan type                |
|     | loan_term     | int       | Term/duration of the loan (in months or years) |

### 8. RepaymentSchedules

Schedule of repayments for loans.

| Key | Column Name           | Data Type | Description                                  |
| --- | --------------------- | --------- | -------------------------------------------- |
| PK  | repayment_schedule_id | int       | Primary key for the repaymentschedules table |
| FK  | application_id        | int       | Foreign key from the applications table      |
|     | monthly_payment       | float     | Amount to be paid monthly                    |
|     | remaining_balance     | float     | Remaining balance to be paid                 |

### 9. PaymentNotes

Notes related to payments.

| Key | Column Name           | Data Type | Description                                   |
| --- | --------------------- | --------- | --------------------------------------------- |
| PK  | note_id               | int       | Primary key for the paymentnotes table        |
| FK  | repayment_schedule_id | int       | Foreign key from the repaymentschedules table |
|     | payment_date          | date      | Date of the payment                           |
|     | payment_amount        | float     | Amount paid                                   |

### 10. MaximumLoanAmounts

Maximum loan amounts for applications.

| Key | Column Name           | Data Type | Description                                       |
| --- | --------------------- | --------- | ------------------------------------------------- |
| PK  | max_loan_amount_id    | int       | Primary key for the maximumloanamounts table      |
| FK  | application_id        | int       | Foreign key from the applications table           |
|     | max_loan_amount       | int       | Maximum loan amount available for the application |
|     | total_interest_amount | float     | Total interest amount for the loan                |

## Enumeration

### 1. User roles

| roles_enam |
| ---------- |
| client     |
| worker     |
| admin      |

### 2. Document types

| doc_enum                |
| ----------------------- |
| passport                |
| employment_verification |
| business_plan           |
| purchase_agreemen       |

### 3. Loan types

| loan_enum               |
| ----------------------- |
| passport                |
| employment_verification |
| business_plan           |
| purchase_agreemen       |

## Relationships

The relationships between the tables are:

- One User can have only one role (one-to-one) at `Doctor(id_user)` || `Patient(id_user)` || `Admin(id_user)`.
- One doctor can have multiple slots associated with them (one-to-many) at `slots(id_doctor)`.
- One schedule can be in a few slots associated with them (one-to-many) at `slots(id_schedule)`.
- One Patient have only one Medical History (one-to-one) at `Medical_History(codeMH)`.
- One Appointment have only one billing (one-to-one) at `appointments(id_appoint)`.
- One Billing can contain many services (one-to-many) at `billing(id_service)`.
- One office can be in many appointments (one-to-many) at `appointments(numberOffice)`.
- One Appointment can have many services (one-to-many) at `appointments(id_services)`.
- One Patient can have many appointments (one-to-many) at `appointments(id_patient)`.
- One Admin can create many appointments (one-to-many) at `appointments(id_admin)`.
- One Doctor can be at many appointments (one-to-many) at `appointments(id_doctor)`.
