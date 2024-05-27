// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
/*
    SETUP
*/
// Express
const express = require('express');
const app = express();
const PORT = 3791;
const path = require('path');
// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');

// app.js
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

/*
    ROUTES
*/
// Display Home Page
app.get('/', function(req, res)
    {
        res.render('index');
    });

// Display Patrons Page
app.get('/patrons', function(req, res)
{
    let query1 = "SELECT * FROM Patrons;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('patrons', { data: results });
        }
    });
});

// Display Transactions Page
app.get('/transactions', function(req, res)
{
    let query1 = "SELECT * FROM Transactions;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('transactions', { data: results });
        }
    });
});

//Display Books Page
app.get('/books', function(req, res)
{
    let query1 = "SELECT * FROM Books;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('books', { data: results });
        }
    });
});

// Display Holds Table
app.get('/holds', function(req, res)
{
        let query1 = "SELECT * FROM Holds;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('holds', { data: results });
        }
    });
});

// DELETES HOLD
app.delete('/delete-hold/:holdID', function(req,res,next){
    let data = req.body;
    console.log(req.params.holdID);
    let deleteHold = `DELETE FROM Holds WHERE holdID = ?`;

          db.pool.query(deleteHold, [req.params.holdID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(deleteHold, [req.params.holdID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  // ADDS HOLD
  app.post('/add-hold-form', function(req, res) {

    let data = req.body;
    let query1 = `INSERT INTO Holds (holdID, bookID, datePlaced, posInQueue, status, notificationPref) VALUES (?, ?, ?, ?, ?, ?)`;

    // Execute the query with parameter values
    db.pool.query(query1, [data.holdID, data.bookID, data.datePlaced, data.posInQueue, data.status, data.notificationPref], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/holds');
        }
    });
});

// UPDATES HOLD
app.put('/update-hold-form', function(req,res,next){
    let data = req.body;

    let holdID = parseInt(data.holdID);
    let status = data.status;
    let notificationPref = data.notificationPref;

    let queryUpdateHold = `UPDATE Holds SET status = ?, notificationPref = ? WHERE holdID = ?`;

          db.pool.query(queryUpdateHold, [ status, notificationPref, holdID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                let selectQuery = 'SELECT * FROM Holds WHERE holdID = ?'
                db.pool.query(selectQuery, [holdID], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// DELETES BOOK
app.delete('/delete-book/:bookID', function(req,res){
    console.log(req.params.bookID);
    let deleteBook = `DELETE FROM Books WHERE bookID = ?`;
          db.pool.query(deleteBook, [req.params.bookID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(deleteBook, [req.params.bookID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  // ADDS BOOK
  app.post('/add-book-form', function(req, res) {
    console.log('Received data:', req.body);
    let data = req.body;
    let query1 = `INSERT INTO Books (title, author, subject, location) VALUES (?, ?, ?, ?)`;

    // Execute the query with parameter values
    db.pool.query(query1, [data.title, data.author, data.subject, data.location], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/books');
        }
    });
});


// Display Patron_Holds Page
app.get('/add_holds', function(req, res)
{
        let query1 = "SELECT * FROM Patron_Holds;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('patron_holds', { data: results });
        }
    });
});

// Display Patron Holds Table
app.get('/patron_holds', function(req, res)
{
        let query1 = "SELECT * FROM Patron_Holds;";
    db.pool.query(query1, function(error, results){
        if (error) {
        res.status(500).send('Database error: ' + error.message);
        } else {
        res.render('patron_holds', { data: results });
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

