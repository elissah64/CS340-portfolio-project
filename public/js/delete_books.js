// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteBook(bookID) {
    const data = {id: bookID}

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/delete-book/${bookID}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
  }
