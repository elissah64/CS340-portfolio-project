// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
/*
    SETUP
*/
// Express
var express = require('express');
var app = express();
PORT = 3790;
const path = require('path');
// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

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

// Display Holds table
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

  // app.js

  app.post('/add-hold-form', function(req, res) {
    let data = req.body;

    // Construct the SQL query using placeholders
    let query1 = `INSERT INTO Holds (name, title, datePlaced, status, notificationPref) VALUES (${name}, ${title}, ${datePlaced}, ${posInQueue}, ${status}, ${notificationPref})`;

    // Execute the query
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/Holds');
        }
    });
});



// Display Patron_Holds Page
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

