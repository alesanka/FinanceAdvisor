CREATE TYPE roles_enum AS ENUM ('user', 'worker', 'admin');

CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255),
    role roles_enum NOT NULL
);


