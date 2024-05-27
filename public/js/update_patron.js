
// Get the objects we need to modify
let updateHoldForm = document.getElementById('update-hold-form');

// Modify the objects we need
updateHoldForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHoldID = document.getElementById("holdSelect");
    let inputStatus = document.getElementById("statusSelect");
    let inputPref = document.getElementById("notificationPrefSelect");

    // Get the values from the form fields
    let holdIDValue = inputHoldID.value;
    let statusValue = inputStatus.value;
    let notificationPrefValue = inputPref.value;

    if (isNaN(holdIDValue))
        {
            return;
        }

    if (isNaN(statusValue))
    {
        return;
    }
    let data = {
        holdID:holdIDValue,
        status: statusValue,
        notificationPref: notificationPrefValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-hold", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, holdIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
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
       }
    }
}
