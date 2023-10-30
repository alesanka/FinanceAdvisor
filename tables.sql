CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE Clients (
    client_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(50),
    UNIQUE(user_id)
);


CREATE TABLE Workers (
    worker_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    position VARCHAR(255) NOT NULL,
    UNIQUE(user_id)
);

CREATE TABLE Admin (
    admin_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    permissions VARCHAR(255) NOT NULL,
    UNIQUE(user_id)
);


CREATE TABLE Documents (
    document_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Clients(client_id),
    doc_type VARCHAR(255) NOT NULL,
    doc_data TEXT NOT NULL
);


CREATE TABLE LoanTypes (
    loan_type_id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES Admin(admin_id),
    loan_name VARCHAR(255) NOT NULL,
    loan_description TEXT
);

CREATE TABLE Applications (
    application_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Clients(client_id),
    worker_id INT REFERENCES Workers(worker_id),
    loan_type_id INT REFERENCES LoanTypes(loan_type_id),
    application_date DATE NOT NULL,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE RepaymentSchedules (
    repayment_schedule_id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES Applications(application_id),
    repayment_date DATE NOT NULL,
    amount DECIMAL(20,2) NOT NULL
);


CREATE TABLE MaximumLoanAmounts (
    max_loan_amount_id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES Applications(application_id),
    amount DECIMAL(20,2) NOT NULL
);


CREATE TABLE PaymentNotes (
    payment_note_id SERIAL PRIMARY KEY,
    repayment_schedule_id INT REFERENCES RepaymentSchedules(repayment_schedule_id),
    note TEXT NOT NULL
);
