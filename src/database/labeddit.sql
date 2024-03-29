-- Active: 1678488407513@@127.0.0.1@3306
-- 1) TABLE users
-- query 1.1
DROP TABLE users;

-- query 1.2
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    receive_emails NUMBER NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- ADMIN (inserido pelo Postman)
-- username: carldonovan
-- email: carldonovan@gmail.com
-- password: passw1rd

-- query 1.3
UPDATE users
SET role = "ADMIN"
WHERE email = "carldonovan@gmail.com";

-- NORMAL USERS (inseridos via Postman)
/*
(username, email, password)
("johntitor", "johntitor@gmail.com", "passw0rd")
("juliaschmidt", "juliaschmidt@gmail.com", "passw1rd")
("alicegrassi", "alicegrassi@gmail.com", "pasZw0rd")
("thomasgrant", "thomasgrant@gmail.com", "paZZw1rd")
*/

-- query 1.4
SELECT * FROM users;

-- 2) TABLE posts
-- query 2.1
DROP TABLE posts;

-- query 2.2
CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT(0),
    downvotes INTEGER DEFAULT(0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- query 2.3
SELECT * FROM posts;

-- 3) TABLE post_votes
-- query 3.1
DROP TABLE post_votes;

-- query 3.2
CREATE TABLE post_votes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    vote INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id)
);

-- query 3.3
SELECT * FROM post_votes;

-- 4) TABLE comments
-- query 4.1
DROP TABLE comments;

-- query 4.2
CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    post_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    upvotes INTEGER NOT NULL,
    downvotes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- query 4.3
SELECT * FROM comments;

-- 5) TABLE comment_votes
-- query 5.1
DROP TABLE comment_votes;

-- query 5.2
CREATE TABLE comment_votes (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    vote INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- query 5.3
SELECT * FROM comment_votes;