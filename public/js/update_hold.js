// Citation for the following function
// Date: 5/22/2024
// Based on:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let updateHoldForm = document.getElementById('update-hold-form');

updateHoldForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHoldID = document.getElementById("holdSelect");
    let inputStatus = document.getElementById("statusSelect");
    let inputPref = document.getElementById("notificationPrefSelect");


    let holdIDValue = parseInt(inputHoldID.value);
    let statusValue = inputStatus.value;
    let notificationPrefValue = inputPref.value;

    if (isNaN(holdIDValue))
        {
            return;
        }

    let data = {
        holdID:holdIDValue,
        status: statusValue,
        notificationPref: notificationPrefValue,
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-hold-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, holdIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, holdID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("holds-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == holdID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].holdID;
            location.reload()
       }
    }
}
