window.addEventListener('load', async function () {
    tablebody = document.getElementsByTagName('tbody')[0];
    table = document.getElementsByTagName('table');

    var tbodyRowCount = tablebody.rows.length;

    //btndashboard and logout
    btndashboard = document.getElementById('btndashboard');
    btnlogout = document.getElementById('btnlogout');
    btnlogout.addEventListener('click', function () {
        window.location.replace("../login.html");
    });

    btndashboard.addEventListener('click', function () {
        window.location.replace("admindashboard.html");
    });

    //

    let records = await fetch(`http://localhost:3000/users`);
    let record = await records.json();
    console.log(record);
    for (i = 0; i < record.length; i++) {
        tbodyRowCount++;
        var newrowemp = document.createElement('tr');
        newrowemp.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${Array(record[i]['firstname']).toString()}</td>
                                    <td style="display:none;">${Array(record[i]['email']).toString()}</td>
                                    <td style="display:none;">${Array(record[i]['lastname']).toString()}</td>
                                    <td style="display:none;">${Array(record[i]['address']).toString()}</td>
                                    <td style="display:none;">${Array(record[i]['age']).toString()}</td>
                                    <td><button type="button" class="btnadd btn btn-success pl-4 pr-4 addnewemp"
                                    btn-lg btn-block">Add</button></td>
                                    <td><button type="button" name="removenewemp" class="btnremove btn btn-danger"
                                    btn-lg btn-block">Delete</button></td> `
        tablebody.appendChild(newrowemp);
    }
});

$(".table .tbody").on('click', '.btnadd', async function () {
    //getting name of current row by clicking add button
    var currentrow = $(this).closest('tr');
    //emp data from the table : 
    var firstname = currentrow.find('td:eq(0)').text();
    var empEmail = currentrow.find('td:eq(1)').text();
    var lastname = currentrow.find('td:eq(2)').text();
    var address = currentrow.find('td:eq(3)').text();
    var age = currentrow.find('td:eq(4)').text();
    var rowNumValue = Number(currentrow.find('th:eq(0)').text()) - 1;
    // console.log(typeof(getEmployeeID(rowNumValue)));
    // console.log(empID);
    let empID = await getEmployeeID(rowNumValue);

    empNewUsername = firstname.toLowerCase() + generateRandomkey(3).toLowerCase() + '@mycomp';
    empPassword = generateRandomkey(5);
    var xhradd = new XMLHttpRequest();
    xhradd.open("POST", "http://localhost:3000/addedemployees", true);
    xhradd.setRequestHeader('Content-Type', 'application/json');
    xhradd.send(JSON.stringify({
        "username": empNewUsername,
        "password": empPassword,
        "email": empEmail,
        "firstname": firstname,
        "lastname": lastname,
        "address": address,
        "age": age
    }));

    //send verification mail to the employee 
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "4liebrahim@gmail.com",
        Password: "DD306A540473001D1C2AFB3C8346978453D2",
        To: empEmail,
        From: "4liebrahim@gmail.com",
        Subject: "This is the test subject",
        Body: `Username : ${empNewUsername} 
            <br> Password : ${empPassword}`
    }).then(
        message => alert(`email sent succesfully to the user : ${firstname} to ${empEmail}`)
    );


    //end of sending verification mail to the employee 

    var url = `http://localhost:3000/users/${Number(empID)}`;

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.table(users);
        } else {
            console.error(users);
            alert("Error .....");
        }
    }
    xhr.send(null);
    // window.location.replace("http://127.0.0.1:5500/html/addnewemployee.html");

    currentrow.remove();
    //remove grandparent tr

});

//remove button event
$(".table .tbody").on('click', '.btnremove', async function () {
    //getting name of current row by clicking add button
    var currentrow = $(this).closest('tr');
    var firstname = currentrow.find('td:eq(0)').text();
    var rowNumValue = Number(currentrow.find('th:eq(0)').text()) - 1;
    // console.log(typeof(getEmployeeID(rowNumValue)));
    // console.log(empID);
    let empID = await getEmployeeID(rowNumValue);
    var url = `http://localhost:3000/users/${Number(empID)}`;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.table(users);
        } else {
            console.error(users);
            alert("Error .....");
        }
    }
    xhr.send(null);
    currentrow.remove();
});
function generateRandomkey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function getEmployeeID(rownum) {
    num = 0;
    await fetch('http://localhost:3000/users').then(response => {
        return response.json();
    }).then(data => {
        num = data[rownum]['id'];
        // console.log(typeof(num));
    }).catch(err => {
        console.log("error....");
    });
    // console.log(typeof(num));
    return num;
}