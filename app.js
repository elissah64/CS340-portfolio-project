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
const PORT = 3796;
const path = require('path');
// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { title } = require('process');
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');

// app.js
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

/*
    ROUTES
*/
// DISPLAY HOME
app.get('/', function (req, res) {
    res.render('index');
});

// DISPLAY PATRON TABLE
app.get('/patrons', function (req, res) {
    let query1 = "SELECT * FROM Patrons;";
    db.pool.query(query1, function (error, results) {
        if (error) {
            res.status(500).send('Database error: ' + error.message);
        } else {
            res.render('patrons', { data: results });
        }
    });
});

// DELETE PATRON
app.delete('/delete-patron/:patronID', function (req, res, next) {
    let data = req.body;
    let deletePatron = `DELETE FROM Patrons WHERE patronID = ?`;

    db.pool.query(deletePatron, [req.params.patronID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deletePatron, [req.params.patronID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// ADD PATRON
app.post('/add-patron-form', function (req, res) {

    let data = req.body;
    let query1 = `INSERT INTO Patrons (patronID, name, address, email, phone) VALUES (?, ?, ?, ?, ?)`;
    // Execute the query with parameter values
    db.pool.query(query1, [data.patronID, data.name, data.address, data.email, data.phone], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/patrons');
        }
    });
});

// UPDATE PATRON
app.put('/update-patron-form', function (req, res, next) {
    let data = req.body;

    let patronID = parseInt(data.patronID);
    let name = data.name;
    let address = data.address;
    let email = data.email;
    let phone = data.phone;

    let queryUpdatePatron = `UPDATE Patrons SET name = ?, address = ?, email = ?, phone = ? WHERE patronID = ?`;

    db.pool.query(queryUpdatePatron, [name, address, email, phone, patronID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            let selectQuery = 'SELECT * FROM Patrons WHERE patronID = ?'
            db.pool.query(selectQuery, [patronID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


// DISPLAY TRANSACTIONS TABLE
app.get('/transactions', function (req, res) {
    let transactionQuery = "SELECT * FROM Transactions;";
    let bookQuery = "SELECT bookID, title FROM Books;";
    let patronQuery = "SELECT patronID, name FROM Patrons;";
    let transactions;
    let books;
    let patrons;
    db.pool.query(transactionQuery, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        transactions = rows;
        db.pool.query(bookQuery, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            books = rows;

            let bookmap = {}
            books.map(book => {
                let bookID = parseInt(book.bookID, 10);
                bookmap[bookID] = book['title'];
            })

            db.pool.query(patronQuery, (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                patrons = rows;

                let patronmap = {}
                patrons.forEach(patron => {
                    let patronID = parseInt(patron.patronID, 10);
                    patronmap[patron.name] = patronID;
                })

                const data = {transactions, books, bookmap, patrons, patronmap}
                res.render('transactions', data);
            })
        })

    });
});



// DELETE TRANSACTION
app.delete('/delete-transaction/:transactionID', function (req, res, next) {
    let data = req.body;
    let deleteTransaction = `DELETE FROM Transactions WHERE transactionID = ?`;

    db.pool.query(deleteTransaction, [req.params.transactionID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deleteTransaction, [req.params.transactionID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});


// ADD TRANSACTION
app.post('/add-transaction-form', function (req, res) {

    let data = req.body;
    let queryAddTransaction = `INSERT INTO Transactions (transactionID, bookID, patronID, transactionDate, transactionType) VALUES (?, ?, ?, ?, ?)`;
    let queryBookInfo = 'SELECT bookID, title FROM Books WHERE title = ?';
    let queryPatronName = 'SELECT patronID, name FROM Patrons WHERE name = ?';
    // Execute the query with parameter values
        // Execute the query with parameter values
        db.pool.query(queryBookInfo, [data.title], function (error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                // Don't run the query if there aren't any rows in the Books table
                if (rows.length > 0) {
                    let bookID = rows[0].bookID;
                    let title = rows[0].title;

                    db.pool.query(queryPatronName, [data.name], function(error, rows, field) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else {
                            if(rows.length > 0) {
                                let patronID = rows[0].patronID;
                                let name = rows[0].name;

                                db.pool.query(queryAddTransaction, [data.transactionID, bookID, title, patronID, name, data.transactionDate, data.transactionType], function (error, rows, fields) {
                                    if (error) {
                                        console.log(error);
                                        res.sendStatus(400);
                                    } else {
                                        res.redirect('/transactions');
                                    }
                                });
                            }

                        }
                    });


                }
            }
        });
    });


// DISPLAY HOLDS TABLE
app.get('/holds', function (req, res) {
    let holdsQuery = "SELECT * FROM Holds;";
    let bookQuery = "SELECT * FROM Books;";
    let holds;
    let books;
    db.pool.query(holdsQuery, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        holds = rows;
        db.pool.query(bookQuery, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            books = rows;

            let bookmap = {}
            books.forEach(book => {
                let bookID = parseInt(book.bookID, 10);
                bookmap[book.title] = bookID;
            })

            const data = {holds, books, bookmap}
            res.render('holds', data)
        })

    });
});

// DELETE HOLD
app.delete('/delete-hold/:holdID', function (req, res, next) {
    let data = req.body;
    let deleteHold = `DELETE FROM Holds WHERE holdID = ?`;

    db.pool.query(deleteHold, [req.params.holdID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deleteHold, [req.params.holdID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// ADD HOLD
app.post('/add-hold-form', function (req, res) {

    let data = req.body;
    let queryAddHold = `INSERT INTO Holds (holdID, bookID, title, datePlaced, posInQueue, status, notificationPref) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let queryBookInfo = 'SELECT bookID, title FROM Books WHERE title = ?';

    // Execute the query with parameter values
    db.pool.query(queryBookInfo, [data.title], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Don't run the query if there aren't any rows in the Books table
            if (rows.length > 0) {
                let bookID = rows[0].bookID;
                let title = rows[0].title;

                db.pool.query(queryAddHold, [data.holdID, bookID, title, data.datePlaced, data.posInQueue, data.status, data.notificationPref], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.redirect('/holds');
                    }
                });
            }
        }
    });
});


// UPDATE HOLD
app.put('/update-hold-form', function (req, res, next) {
    let data = req.body;

    let holdID = parseInt(data.holdID);
    let status = data.status;
    let notificationPref = data.notificationPref;

    let queryUpdateHold = `UPDATE Holds SET status = ?, notificationPref = ? WHERE holdID = ?`;
    let selectQuery = 'SELECT * FROM Holds WHERE holdID = ?'

    db.pool.query(queryUpdateHold, [status, notificationPref, holdID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectQuery, [holdID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

//DISPLAY BOOKS TABLE
app.get('/books', function (req, res) {
    let query1 = "SELECT * FROM Books;";
    db.pool.query(query1, function (error, results) {
        if (error) {
            res.status(500).send('Database error: ' + error.message);
        } else {
            res.render('books', { data: results });
        }
    });
});

// DELETE BOOK
app.delete('/delete-book/:bookID', function (req, res) {
    console.log(req.params.bookID);
    let deleteBook = `DELETE FROM Books WHERE bookID = ?`;
    db.pool.query(deleteBook, [req.params.bookID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deleteBook, [req.params.bookID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// ADD BOOK
app.post('/add-book-form', function (req, res) {
    console.log('Received data:', req.body);
    let data = req.body;
    let query1 = `INSERT INTO Books (bookID, title, author, subject, location) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query with parameter values
    db.pool.query(query1, [data.bookID, data.title, data.author, data.subject, data.location], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/books');
        }
    });
});

// UPDATE BOOK
app.put('/update-book-form', function (req, res, next) {
    let data = req.body;

    let bookID = parseInt(data.bookID);
    let title = data.title;
    let author = data.author;
    let subject = data.subject;
    let location = data.location;

    let queryUpdateBook = `UPDATE Books SET title = ?, author = ?, subject = ?, location = ? WHERE bookID = ?`;

    db.pool.query(queryUpdateBook, [title, author, subject, location, bookID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            let selectQuery = 'SELECT * FROM Books WHERE bookID = ?'
            db.pool.query(selectQuery, [bookID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


// DISPLAY PATRON_HOLDS TABLE
app.get('/patron_holds', function (req, res) {
    let query1 = "SELECT * FROM Patron_Holds;";
    db.pool.query(query1, function (error, results) {
        if (error) {
            res.status(500).send('Database error: ' + error.message);
        } else {
            res.render('patron_holds', { data: results });
        }
    });
});

// DELETE PATRON_HOLD
app.delete('/delete-patron-hold/:patron_holdID', function (req, res, next) {
    let data = req.body;
    let deletePatronHold = `DELETE FROM Patron_Holds WHERE patron_holdID = ?`;

    db.pool.query(deletePatronHold, [req.params.patron_holdID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(deletePatronHold, [req.params.patron_holdID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// ADD PATRON_HOLDS
app.post('/add-patron_hold-form', function (req, res) {

    let data = req.body;
    let query1 = `INSERT INTO Patron_Holds (patron_holdID, name, title, transactionDate) VALUES (?, ?, ?, ?)`;
    // Execute the query with parameter values
    db.pool.query(query1, [data.patronID, data.name, data.address, data.email, data.phone], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/patron_holds');
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
