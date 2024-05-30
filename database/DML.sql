-- BOOKS
-- SELECT BOOKS TABLE
SELECT
    Books.bookID AS ID,
    Books.title AS Title,
    Books.author AS Author,
    Books.subject AS Genre,
    Books.location AS Section
    FROM Books;

-- ADD TO BOOKS TABLE
INSERT INTO Books (title, author, subject, location)
VALUES (:title, :author, :subject, :location);

-- UPDATE ENTRY IN BOOKS TABLE
UPDATE Books SET
    title = :title,
    author = :author,
    subject = :subject,
    location = :location
    WHERE bookID = :bookID;

-- DELETE A BOOK
DELETE FROM Books WHERE bookID = :bookID;


-- HOLDS
-- SELECT HOLDS TABLE
SELECT
    Holds.holdID AS ID,
    Books.title AS "Book Title"
    Holds.datePlaced AS "Date",
    Holds.posInQueue AS "Position in Queue",
    Holds.Status AS "Status",
    Holds.notificationPref AS "Notification Preference"
    FROM Holds
    INNER JOIN Books ON Books.bookID = Holds.bookID;

-- ADD TO HOLDS TABLE
INSERT INTO Holds (bookID, datePlaced, posInQueue, status, notificationPref)
VALUES (:bookID, :datePlaced, :posInQueue, :status, :notificationPref);

-- UPDATE ENTRY IN HOLDS TABLE
UPDATE Holds SET
    bookID = (SELECT bookID FROM Books WHERE title = :title),
    datePlaced = :datePlaced,
    posInQueue = :posInQueue,
    status = :status,
    notificationPref = :notificationPref
    WHERE holdID = :holdID;

-- DELETE A HOLD
DELETE FROM Holds WHERE holdID = :holdID;


-- PATRONS
-- SELECT PATRONS TABLE
SELECT
    Patrons.patronID AS ID,
    Patrons.name AS Name,
    Patrons.address AS Address,
    Patrons.email AS Email,
    Patrons.phone AS "Phone Number"
    FROM Patrons;

-- ADD TO PATRONS TABLE
INSERT INTO Patrons (name, address, email, phone)
VALUES (:name, :address, :email, :phone);

-- UPDATE ENTRY IN PATRONS TABLE
UPDATE Patrons SET
    name = :name,
    address = :address,
    email = :email,
    phone = :phone
    WHERE patronID = :patronID;

-- DELETE A PATRON
DELETE FROM Patrons WHERE patronID = :patronID;


-- TRANSACTIONS
-- SELECT TRANSACTIONS TABLE
SELECT
    Transactions.transactionID AS ID,
    Books.title AS "Book Title",
    Patrons.name AS "Patron Name",
    Transactions.transactionDate AS Date,
    Transactions.transactionType AS "Transaction Type"
    FROM Transactions
    INNER JOIN Books ON Books.bookID = Transactions.bookID
    INNER JOIN Patrons ON Patrons.patronID = Transactions.patronID;

-- ADD TO TRANSACTIONS TABLE
INSERT INTO Transactions (bookID, patronID, transactionDate, transactionType)
VALUES (:bookID, :patronID, :transactionDate, :transactionType);

-- UPDATE ENTRY IN TRANSACTIONS TABLE
UPDATE Transactions SET
    bookID = (SELECT bookID FROM Books WHERE title = :title),
    patronID = (SELECT patronID FROM Patrons WHERE name = :name),
    transactionDate = :transactionDate,
    transactionType = :transactionType
    WHERE transactionID = :transactionID;

-- DELETE A TRANSACTION
DELETE FROM Transactions WHERE transactionID = :transactionID;

-- PATRON_HOLDS
-- SELECT PATRON_HOLDS TABLE
SELECT
    Patron_Holds.patron_holdID AS ID,
    Patrons.name AS "PatronName",
    Books.title AS "BookTitle",
    Holds.datePlaced AS "DatePlaced"
    FROM Patron_Holds
    INNER JOIN Holds ON Holds.holdID = Patron_Holds.holdID
    INNER JOIN Books ON Holds.bookID = Books.bookID;
    INNER JOIN Patrons ON Patrons.patronID = Patron_Holds.patronID;

-- ADD TO PATRON_HOLDS TABLE
INSERT INTO Patron_Holds (patronID, bookID, holdID)
VALUES (:name, title, datePlaced);

-- UPDATE ENTRY IN PATRON_HOLDS TABLE
UPDATE Patron_Holds SET
    patron_holdID = :patron_holdID
    name = (SELECT name FROM Patrons WHERE name = :name),
    title = (SELECT title FROM Books WHERE title = :title),
    datePlaced = (SELECT datePlaced FROM Holds WHERE datePlaced = :datePlaced)
    WHERE patron_holdID = :patron_holdID;

-- DELETE A TRANSACTION
DELETE FROM Patron_Holds WHERE patron_holdID = :patron_holdID;
