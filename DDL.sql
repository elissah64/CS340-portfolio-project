/* Group #97
   Members: Elissa Hada and Gwen Thompson
   Project: Step 2 Draft */


/* Create the tables */
CREATE TABLE IF NOT EXISTS Books (
	bookID int NOT NULL AUTO_INCREMENT UNIQUE, 
	title varchar(255) NOT NULL,
	author varchar(255) NOT NULL,
	subject varchar(255) NOT NULL, 
	location varchar(255) NOT NULL,
	PRIMARY KEY (bookID)
);

CREATE TABLE IF NOT EXISTS Holds (
	holdID int NOT NULL AUTO_INCREMENT UNIQUE,
	bookID int NOT NULL,
	datePlaced date NOT NULL DEFAULT CURRENT_DATE,
	posInQueue int NOT NULL, 
	expirationDate date, 
	status ENUM('Pending', 'Complete', 'Active', 'Canceled', 'Expired') NOT NULL,
	notificationPref ENUM('email', 'call', 'text', 'none'),
	PRIMARY KEY (holdID), 
	FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE RESTRICT
	/* If a book is on hold, we cannot delete the bookID, the hold must be dealt with first */
);

CREATE TABLE IF NOT EXISTS Patrons (
	patronID INT NOT NULL AUTO_INCREMENT UNIQUE,
	name varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(20) NOT NULL,
	PRIMARY KEY (patronID)
);

CREATE TABLE IF NOT EXISTS Transactions (
	transactionID int NOT NULL AUTO_INCREMENT UNIQUE, 
	bookID int NOT NULL,
	patronID int NOT NULL,
	transactionDate date NOT NULL DEFAULT CURRENT_DATE,
	transactionType ENUM('Checkout', 'Return'),
	PRIMARY KEY (transactionID), 
	FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE CASCADE,
	FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE
	/* For both bookID and patronID, if either one is deleted in their parent table, delete the transaction */
);

/* Create intersection table */
CREATE TABLE IF NOT EXISTS Patron_Holds (
	patron_holdID int NOT NULL AUTO_INCREMENT UNIQUE, 
	holdID int NOT NULL, 
	patronID int NOT NULL,
	PRIMARY KEY (patron_holdID), 
	FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE,
	FOREIGN KEY (holdID) REFERENCES Holds(holdID) ON DELETE CASCADE
	/* If a patron or hold is deleted, they should be removed from the intersection table */
);

/* Insert the example data into the tables */

INSERT INTO Books (title, author, subject, location)
VALUES
('The Martian', 'Andy Weir', 'Science Fiction', 'Fiction Section'), 
('Gone With the Wind', 'Margaret Mitchell', 'Historical Fiction', 'Fiction Section'),
('Where the Red Fern Grows', 'Wilson Rawls', 'Adventure', 'Young Adult Section'),
('The Shining', 'Stephen King', 'Horror', 'Horror/Thriller Section'),
('Fahrenheit 451', 'Ray Bradbury', 'Dystopian Fiction', 'Fiction Section'),
('Dune', 'Frank Herbert', 'Science Fiction', 'Fiction Section');

INSERT INTO Patrons (name, address, email, phone)
VALUES
('Erard Swiftfoot', 'Swiftfoot Fort, Hobbiton', 'ESwiftfoot@hobbits.com', '248-988-6869'),
('Leudast Chubb', 'Hidey Hole, Hobbiton', 'LeadastRules@hobbits.com', '248-357-1129'),
('Merwig Greenhand', 'Greenhand Gardens, Hobbiton', 'MerryMerwig@hobbits.com', '248-844-1564'),
('Poppy Puddifoot', 'Pleasant Pit, Hobbiton', 'Po11y@hobbits.com', '248-247-9377');

INSERT INTO Transactions (bookID, patronID, transactionDate, transactionType)
VALUES
((SELECT bookID FROM Books WHERE title = 'The Martian'),
(SELECT patronID FROM Patrons WHERE name = 'Poppy Puddifoot'), '2024-04-01', 'Checkout'),
((SELECT bookID FROM Books WHERE title = 'Dune'), 
(SELECT patronID FROM Patrons WHERE name = 'Erard Swiftfoot'), '2024-04-03', 'Checkout'),
((SELECT bookID FROM Books WHERE title = 'The Shining'),
(SELECT patronID FROM Patrons WHERE name = 'Leudast Chubb'), '2024-04-05', 'Checkout');

INSERT INTO Holds (bookID, datePlaced, posInQueue, status, notificationPref)
VALUES
((SELECT bookID FROM Books WHERE title = 'The Martian'), '2024-04-02', 1, 'Pending', 'email'),
((SELECT bookID FROM Books WHERE title = 'The Martian'), '2024-04-03', 2, 'Pending', 'text'),
((SELECT bookID FROM Books WHERE title = 'Where the Red Fern Grows'), '2024-04-05', 1, 'Active', 'call'),
((SELECT bookID FROM Books WHERE title = 'Dune'), '2024-04-06', 1, 'Pending', 'call');

INSERT INTO Patron_Holds (patronID, holdID)
VALUES
((SELECT patronID FROM Patrons WHERE name = 'Merwig Greenhand'), 1),
((SELECT patronID FROM Patrons WHERE name = 'Erard Swiftfoot'), 2),
((SELECT patronID FROM Patrons WHERE name = 'Poppy Puddifoot'), 3),
((SELECT patronID FROM Patrons WHERE name = 'Leudast Chubb'), 4);

SELECT * FROM Patrons;
SELECT * FROM Books;
SELECT * FROM Transactions;
SELECT * FROM Holds;
SELECT * FROM Patron_Holds;

DESCRIBE Patrons;
DESCRIBE Books;
DESCRIBE Transactions;
DESCRIBE Holds;
DESCRIBE Patron_Holds;
