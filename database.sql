CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

CREATE DATABASE VoyaWealthManagement;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    age TEXT NOT NULL,
    us_investor TEXT NOT NULL,
    investor_type TEXT NOT NULL,
    account_type TEXT NOT NULL,
    investor_status TEXT NOT NULL,
    hear_about TEXT NOT NULL,
    capital TEXT NOT NULL,
    funds_type TEXT NOT NULL,
    love_to_know VARCHAR(1000),
    bitcoin_address VARCHAR(200) NOT NULL
);

SELECT * FROM users;

INSERT INTO users (user_name,user_email,user_password) VALUES ('bob','bob@gmail.com','bob');


--Psql -U postgres
--\c VoyaWealthManagement
--\dt
--heroku pg:psql