DO $$ BEGIN
    CREATE TYPE roles_enum AS ENUM ('user', 'worker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255),
    role roles_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS Clients (
    client_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    name VARCHAR(255) NOT NULL,
    salary INT NOT NULL,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS Workers (
    worker_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    name VARCHAR(255) NOT NULL,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS Admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id),
    name VARCHAR(255) NOT NULL,
    UNIQUE(user_id)
);




