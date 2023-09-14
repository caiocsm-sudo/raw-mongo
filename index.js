const express = require('express');
const mongooose = require('mongoose');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

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
      message: 'Book added successfully'
    });
  }).catch(e => res.status(500).json({ error: "Could not create new document: " + e }))
});

app.delete('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id))
    db.collection('books')
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(result => {
        res.status(200).json({
          result
        });
      }).catch(e => console.log(e));
});

app.patch('/books/:id', (req, res) => {
  const update = req.body;
  if (ObjectId.isValid(req.params.id))
    db.collection('books')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
      .then(result => {
        res.status(200).json({ message: 'Document updated successfully', result });
      })
      .catch(e => res.status(500).json({ message: 'Could not update document: ' + e }));
  else res.status(500).json({ message: 'Not a valid id' });
});
