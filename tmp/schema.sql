DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL,
    name text,
    email text,
    password text,
    avatar text,
    date timestamp,
    primary key(id)
);
