// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let updateBookForm = document.getElementById('update-book-form');

updateBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("bookIDSelect");
    let inputTitle = document.getElementById("titleSelect");
    let inputAuthor = document.getElementById("authorSelect");
    let inputSubject = document.getElementById("subjectSelect");
    let inputLocation = document.getElementById("locationSelect");


    let bookIDValue = parseInt(inputBookID.value);
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;
    let subjectValue = inputSubject.value;
    let locationValue = inputLocation.value;

    if (isNaN(bookIDValue))
        {
            return;
        }

    let data = {
        bookID:bookIDValue,
        title: titleValue,
        author: authorValue,
        subject: subjectValue,
        location: locationValue,
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-book-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, bookIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
        location.reload()
    }
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, bookID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("books-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == bookID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].bookID;
            location.reload()
       }
    }
}
