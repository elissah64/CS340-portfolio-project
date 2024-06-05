/* Group #97
   Members: Elissa Hada and Gwenn Thompson
   Project: Step 2 Draft */

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/* Create the tables */
DROP TABLE IF EXISTS Books;
CREATE TABLE IF NOT EXISTS Books (
	bookID int NOT NULL AUTO_INCREMENT UNIQUE,
	title varchar(255) NOT NULL,
	author varchar(255) NOT NULL,
	subject varchar(255) NOT NULL,
	location varchar(255) NOT NULL,
	PRIMARY KEY (bookID)
);

DROP TABLE IF EXISTS Patrons;
CREATE TABLE IF NOT EXISTS Patrons (
	patronID INT NOT NULL AUTO_INCREMENT UNIQUE,
	transactionID int,
	holdID int,
	name varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(20),
	PRIMARY KEY (patronID),
	FOREIGN KEY (transactionID) REFERENCES Transactions(transactionID),
	FOREIGN KEY (holdID) REFERENCES Holds(holdID)
);

DROP TABLE IF EXISTS Holds;
CREATE TABLE IF NOT EXISTS Holds (
	holdID int NOT NULL AUTO_INCREMENT UNIQUE,
	patronID int unique not NULL,
	bookID int NOT NULL,
	name varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	datePlaced date NOT NULL DEFAULT CURRENT_DATE,
	posInQueue int NOT NULL,
	status ENUM('Pending', 'Complete', 'Active', 'Canceled', 'Expired') NOT NULL,
	notificationPref ENUM('email', 'call', 'text', 'none'),
	PRIMARY KEY (holdID),
	FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE,
	FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE RESTRICT
);
/* If a book is on hold, we cannot delete the bookID, the hold must be dealt with first */


DROP TABLE IF EXISTS Transactions;
CREATE TABLE IF NOT EXISTS Transactions (
	transactionID int NOT NULL AUTO_INCREMENT UNIQUE,
	bookID int NOT NULL,
	patronID int NOT NULL,
	title varchar(255) NOT NULL,
	name varchar(255) NOT NULL,
	transactionDate date NOT NULL DEFAULT CURRENT_DATE,
	transactionType ENUM('Checkout', 'Return') NOT NULL,
	PRIMARY KEY (transactionID),
	FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE CASCADE,
	FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE
	/* For both bookID and patronID, if either one is deleted in their parent table, delete the transaction */
);

/* Create intersection table */
/* NULLable relationship between holds and patrons */
DROP TABLE IF EXISTS Patron_Holds;
CREATE TABLE IF NOT EXISTS Patron_Holds (
	patron_holdID int NOT NULL AUTO_INCREMENT UNIQUE,
    patronID int NOT NULL,
	holdID int,
	PRIMARY KEY (patron_holdID),
	FOREIGN KEY (patronID) REFERENCES Patrons(patronID) ON DELETE CASCADE,
	FOREIGN KEY (holdID) REFERENCES Holds(holdID) ON DELETE CASCADE,

	/* If a patron or hold is deleted, they should be removed from the intersection table */
);



DESCRIBE Patrons;
DESCRIBE Books;
DESCRIBE Transactions;
DESCRIBE Holds;
DESCRIBE Patron_Holds;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
