DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  image VARCHAR(500),
  title VARCHAR(100),
  author VARCHAR(100),
  description VARCHAR(500)
);

INSERT INTO books (image, title, author, description)
VALUES ()