'use strict';

// application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors());
app.get('/api/v1/books', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url
    FROM books;
  `)
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.get('*', (request, response) => response.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

/*
PORT=3000;
CLIENT_URL=http://localhost:8080;
DATABASE_URL=postrgres://localhost:5432/books_app;
*/