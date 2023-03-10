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
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- query 2.3
SELECT * FROM posts;

-- 3) TABLE votes_posts
-- query 3.1
DROP TABLE votes_posts;

-- query 3.2
CREATE TABLE votes_posts (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    upvote INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE (user_id, post_id)
)

-- query 3.3
SELECT * FROM votes_posts;

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
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- query 4.3
SELECT * FROM comments;

-- 5) TABLE votes_comments
-- query 5.1
DROP TABLE votes_comments;

-- query 5.2
CREATE TABLE votes_comments (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    upvote INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);

-- query 5.3
SELECT * FROM votes_comments;