// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteHold(holdID) {
  const data = {id: holdID}

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", `/delete-hold/${holdID}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          //deleteRow(holdID);
          location.reload()
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  xhttp.send(JSON.stringify(data));
}


/* function deleteRow(holdID){

  let table = document.getElementById("holds-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == holdID) {
          table.deleteRow(i);
          break;
     }
  }
} */
