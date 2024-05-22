// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();           // We need to instantiate an express object to interact with the server in our code
PORT        = 3791;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));


/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });

    /*
// Read
app.get('/patrons', function(req, res)
    {
        let query1 = "SELECT * FROM Patrons;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('patrons', {data: rows});
        })
    });

// Delete
app.delete('/delete-hold/:holdID', function(req,res,next){
    let data = req.body;
    let holdID = parseInt(data.id);
    let deleteHold = `DELETE FROM Holds WHERE pid = holdID`;
    let deletePatronHold= `DELETE FROM Patron_Holds WHERE id = holdID`;


          // Run the 1st query
          db.pool.query(deleteHold, [holdID], function(error, rows, fields){
              if (error) {

              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }

              else
              {
                  // Run the second query
                  db.pool.query(deletePatronHold, [holdID], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});*/




/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
