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
VALUES('boring Book', 'authorOne', '1234', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7OW4AA5HsjrilYT86d5WFYcooJYccLY2ot-eVV71s81KZrWYD', 'The Exciting world of math', 'shelfthingy');
INSERT INTO books (title, author, isbn, image, description, bookshelf)
VALUES('bookTwo', 'authorTwo', '5678', 'https://cdn6.picryl.com/photo/1895/12/31/second-jungle-book-book-cover-f9b55f-1600.jpg', 'This is the best book ever exepct for any book ever published', 'shelfthingy');