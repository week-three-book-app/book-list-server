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
app.get('/api/v1/books', (req, res) => res.send('Testing 1, 2, 3'));

// Make query here
app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

/*
PORT=3000;
CLIENT_URL=http://localhost:8080;
DATABASE_URL=postrgres://localhost:5432/books_app;
*/