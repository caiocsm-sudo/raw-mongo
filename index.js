const express = require('express');
const mongooose = require('mongoose');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./database/db');

const app = express();
const port = process.env.PORT || 5000;
let db;

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

app.get('/books/:id', async (req, res) => {
  let books = [];
  // reference collection, sort, return a cursor.
  // Then, a cursor method, like forEach to iterate each document.
  // a promise that can be resolved

  if (req.params.id) {
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
  } else {
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
  }
});
