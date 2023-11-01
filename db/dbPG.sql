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
