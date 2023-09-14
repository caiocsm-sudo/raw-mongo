const express = require('express');
const mongooose = require('mongoose');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./database/db');

const app = express();
const port = process.env.PORT || 3000;
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb((err) => {
  if (!err) {
    db = getDb();
    app.listen(port, () => {
      console.log('http://localhost:' + port + '/books');
    });
  } else {
    console.log(err);
  }
});

app.get('/books', async (req, res) => {
  let books = [];

  db.collection('books')
    .find()
    .toArray()
    .then((el) => {
      res.status(200).json(el);
    })
    .catch(e => {
      res.status(500).json({
        error: 'could not fetch the book'
      });
    });
});

app.get('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id))
    db.collection('books')
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(el => {
        res.status(200).json({
          data: el
        });
      })
      .catch(e => {
        res.status(500).json({
          error: 'could not fetch data'
        });
      });
  else res.status(500).json({ error: 'Not a valid id' });
});

app.post('/books', (req, res) => {
  const book = req.body;

  db.collection('books').insertOne(book).then(result => {
    res.status(200).json({
      result
    });
  }).catch(e => res.status(500).json({ error: "Could not create new document: " + e }))
});
