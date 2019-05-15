DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn NUMERIC(20),
  image VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)   
);

INSERT INTO books (title, author, isbn, image, description, bookshelf)
VALUES('bookOne', 'authorOne', '1234', 'imageLink', 'description???', 'shelfthingy');