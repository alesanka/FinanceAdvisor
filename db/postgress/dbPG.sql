DO $$ BEGIN
    CREATE TYPE roles_enum AS ENUM ('client', 'worker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE loans_enum AS ENUM ('personal_loan', 'mortgage', 'student_loan', 'business_loan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE docs_enum AS ENUM ('passport', 'purchase_agreement', 'student_verification', 'business_plan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255),
    role roles_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS Clients (
    client_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    credit_story BOOLEAN DEFAULT false,
    salary INT NOT NULL,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS LoanTypes (
    loan_type_id SERIAL PRIMARY KEY,
    loan_type loans_enum UNIQUE NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL CHECK (interest_rate > 0),
    loan_term INT NOT NULL CHECK (loan_term > 0),
    required_doc docs_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS MaximumLoanAmounts (
    max_loan_amount_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Clients(client_id) ON DELETE CASCADE,
    max_loan_amount INT NOT NULL,
    total_interest_amount DECIMAL(20,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS LoanTypes_MaximumLoanAmounts(
id SERIAL PRIMARY KEY,
loan_type_id INT REFERENCES LoanTypes(loan_type_id) ON DELETE CASCADE,
max_loan_amount_id INT REFERENCES MaximumLoanAmounts(max_loan_amount_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LoanApplications(
    application_id SERIAL PRIMARY KEY,
    id INT REFERENCES LoanTypes_MaximumLoanAmounts(id) ON DELETE CASCADE,
    desired_loan_amount INT NOT NULL,
    application_date DATE NOT NULL,
    is_approved BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS Documents (
    document_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES LoanApplications(application_id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type docs_enum NOT NULL
);


CREATE TABLE IF NOT EXISTS RepaymentSchedules (
    repayment_schedule_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES LoanApplications(application_id) ON DELETE CASCADE,
    monthly_payment DECIMAL(20,2) NOT NULL,
    remaining_balance DECIMAL(20,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS PaymentNotes (
    note_id SERIAL PRIMARY KEY,
    repayment_schedule_id INT REFERENCES RepaymentSchedules(repayment_schedule_id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(20,2) NOT NULL,
    payment_received BOOLEAN DEFAULT false
);

