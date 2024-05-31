
// Get the objects we need to modify
let updatePatronForm = document.getElementById('update-patron-form');

// Modify the objects we need
updatePatronForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatronID = document.getElementById("patronIDSelect");
    let inputName = document.getElementById("nameSelect");
    let inputAddress = document.getElementById("addressSelect");
    let inputEmail = document.getElementById("emailSelect");
    let inputPhone = document.getElementById("phoneSelect");

    // Get the values from the form fields
    let patronIDValue = parseInt(inputPatronID.value);
    let nameValue = inputName.value;
    let addressValue = inputAddress.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;

    if (isNaN(patronIDValue))
        {
            return;
        }

    let data = {
        patronID:patronIDValue,
        name:nameValue,
        address:addressValue,
        email:emailValue,
        phone:phoneValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-patron", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, patronIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
        location.reload()
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, patronID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("patrons-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == patronID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].patronID;
       }
    }
}
