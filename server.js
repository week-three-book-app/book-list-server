'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true });

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/api/v1/books', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url
    FROM books;
  `)
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {title, author, image_url, isbn, description} = req.body;
  client.query(`
    INSERT INTO books(title, author, image_url, isbn, description) VALUES ($1, $2, $3, $4, $5);`, [title, author, image_url, isbn, description])
    .then(() => res.sendStatus(201))
    .catch(console.error);
});

app.put('/api/v1/books/:book_id', bodyParser, (req, res) => {
  let {title, author, image_url, isbn, description} = req.body;
  client.query(`
    UPDATE books
    SET title=$1, author=$2, image_url=$3, isbn=$4, description=$5
    WHERE book_id=$6`,
    [title, author, image_url, isbn, description, req.params.book_id])
    .then(() => res.sendStatus(204))
    .catch(console.error);
});

app.get('/api/v1/books/:book_id', (req, res) => {
  client.query(`
  SELECT * FROM books WHERE book_id=${req.params.book_id};
  `)
    .then(result => res.send(result.rows))
    .catch(console.error);
});

app.delete('/api/v1/books/:book_id', (req, res) => {
  client.query(`
  DELETE FROM books WHERE book_id=$1`, [req.params.book_id])
    .then(() => res.sendStatus(204))
    .catch(console.error);
});

app.get('*', (request, response) => response.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

/*
export PORT=3000;
export CLIENT_URL=http://localhost:8080;
export DATABASE_URL=postrgres://localhost:5432/books_app;
export TOKEN=4321;
*/