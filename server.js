'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;

//DB setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', getBooks);
app.post('/searches', createSearch);
app.get('/searches/new', newSearch);
app.post('/books', createBook);
app.get('/books/:id', getOneBook);
app.get('/details/:detail_id', viewDetails);

// Catch-all
app.get('*', (request, response) =>
  response.status(404).send('This route does not exist')
);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//Error Handler!
function handleError(err, res) {
  console.error(err);
  if (res) res.render('pages/error');
}

// HELPER FUNCTIONS
function Book(info) {
  // console.log(info)
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.volumeInfo.title || 'No title available';
  this.author = info.volumeInfo.authors || 'Author Not Avaliable';
  this.isbn = info.volumeInfo.industryIdentifiers[0].identifier || info.volumeInfo.industryIdentifiers[1].identifier || 'No ISBN available';
  this.description = info.volumeInfo.description || 'No Description, Sorry.';
  this.id = info.volumeInfo.industryIdentifiers[0].identifier || '';
  this.image = info.volumeInfo.imageLinks.thumbnail || placeholderImage;
}

// Get the Data and Return

function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';
  return client.query(SQL)
    .then(results => {
      if(results.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else{
        response.render('./pages/index', { books: results.rows });
      }})
    .catch(err => handleError(err,response));
}

function getOneBook(request, response) {
  getBookshelves() //to be used in the future
    .then(shelves => {
      let SQL = 'SELECT * FROM books WHERE id=$1;';
      let values = [request.params.id];
      client.query(SQL, values)
        .then(result => response.render('pages/books/show', { book: result.rows[0], bookshelves: shelves.rows }))
        .catch(err => handleError(err, response));
    })
}

function getBookshelves() {
  let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  return client.query(SQL);
}
// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render('pages/searches/new');
}

function createBook(request, response){
  let bookshelf = request.body.bookshelf.toUpperCase();

  let {title,author,isbn,image,description} =request.body;
  let SQL = 'INSERT INTO books(title, author, isbn, image, description, bookshelf) VALUES($1, $2, $3, $4, $5, $6);';
  let values = [title,author,isbn,image,description,bookshelf];
  console.log('SHIT WORKS');
  return client.query(SQL,values)
    .then(() => {
      SQL = 'SELECT * FROM books WHERE isbn=$1;';
      values = [request.body.isbn];
      return client.query(SQL,values)
        .then(result => response.redirect(`/books/${result.rows[0].id}`))
        .catch(handleError);
    })
    .catch(err => handleError(err,response));
}

// Console.log request.body and request.body.search
function createSearch(request, response) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult))
    )
    .then(results => response.render('./pages/searches/show', { results: results })
    )
    .catch(err => {handleError(err, response);
    });
}

function viewDetails(request, response) {
  let isbn = request.params.detail_id;
  let url = `https://www.googleapis.com/books/v1/volumes?q=+isbn${isbn}`;
  superagent.get(url).then(isbnResult => {
    let bookDetail = new Book(isbnResult.body.items[0].volumeInfo);
    response.render('pages/books/detail', { results: [bookDetail] });
  });
}
