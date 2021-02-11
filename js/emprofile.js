
//on page load ,first check if there is a logged in user or not 
if (sessionStorage.getItem('status') == null) {
    window.location.replace("../login.html");
}

window.addEventListener('load', function () {
    //getting my elements to work with ...
    formconfirmattend = document.getElementById('formconfirmattend');
    alertsuccess1 = document.getElementById('alertsuccess1');
    alertfailed1 = document.getElementById('alertfailed1');
    alertsuccess2 = document.getElementById('alertsuccess2');
    alertfailed2 = document.getElementById('alertfailed2');

    usernameWelcomeLbl = document.getElementById('usernameWelcomeLbl');
    lblempnameconfirmed = document.getElementById('lblempnameconfirmed');
    lblattendancetime = document.getElementById('lblattendancetime');


    confirmbtn = document.getElementById('confirmbtn');
    statusWelcomeh5 = document.getElementById('statusWelcomeh5');
    btnshowstatus = document.getElementById('btnshowstatus');
    btnshowreportname = document.getElementById('btnshowreportname');
    lblshowtimereport = document.getElementById('lblshowtimereport');
    lblreportemp = document.getElementById('lblreportemp');

    //get logout link a 
    btnlogout = document.getElementById('btnlogout');

    //get showreportbtn
    showreportbtn = document.getElementById('showreportbtn');

    //get elements to show monthly report
    lblAttendMonthly = document.getElementById('lblAttendMonthly');
    lblLateMonthly = document.getElementById('lblLateMonthly');
    lblAbsenceMonthly = document.getElementById('lblAbsenceMonthly');
    lbltotalDays = document.getElementById('lbltotalDays');


    //when the profile page loads
    usernameWelcomeLbl.innerText = "Welcome " + sessionStorage.getItem('firstname') + " " + sessionStorage.getItem('lastname');
    btnshowreportname.innerHTML = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");

    lblreportemp.innerHTML = sessionStorage.getItem('firstname') + " " + sessionStorage.getItem('lastname');
    lblattendancetime.innerHTML = sessionStorage.getItem('confirmedDate');
    lblshowtimereport.innerHTML = sessionStorage.getItem('confirmedDate');

    empusername = sessionStorage.getItem('username');

    alertsuccess1.style.display = "none";
    alertsuccess2.style.display = "none";
    alertfailed2.style.display = "block";
    btnshowstatus.style.display = "none";

    //open session to ensure that the user confirmed one time before
    if (sessionStorage.getItem('flagConfirmed') == 1) {
        formconfirmattend.remove();
        alertsuccess1.style.display = "block";
        alertsuccess2.style.display = "block";
        alertfailed1.style.display = "none";
        alertfailed2.style.display = "none";
        btnshowstatus.style.display = "inline-block";
        lblattendancetime.innerHTML = sessionStorage.getItem('confirmedDate');
    }

    confirmbtn.addEventListener('click', async function () {
        //check if the data of the txtbox is not valid 
        sessionStorage.setItem('flagConfirmed', 0);
        if (usernametxt.value == "" || usernametxt.value != sessionStorage.getItem('username')) {
            alert("enter valid data");
        }
        //else the data of the txtbox is valid 
        else {// 
            confirmedDate = new Date();
            sessionStorage.setItem('confirmedDate', confirmedDate.toLocaleString());
            let late = 0;
            let confirmeddatex = confirmedDate.getHours();
            let confirmeddatey = confirmedDate.getMinutes();
            if (confirmeddatex < 09) {
                late = 0;
            }
            else if (confirmeddatex == 09 && (confirmeddatey - 00) <= 10) {
                late = 0;
            }
            else {
                late = 1;
            }
            //store the employee attendance data to the json db
            let dataa = {
                "emp_username": usernametxt.value,
                "attendancedate": confirmedDate,
                "late": late,
                "firstname": sessionStorage.getItem('firstname'),
                "lastname": sessionStorage.getItem('lastname')
            };
            await fetch('http://localhost:3000/attendance', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataa)
            });
            sessionStorage.setItem('flagConfirmed', 1);
            formconfirmattend.remove();
            alertsuccess1.style.display = "block";
            alertsuccess2.style.display = "block";
            alertfailed1.style.display = "none";
            alertfailed2.style.display = "none";
            btnshowstatus.style.display = "inline-block";

            btnshowreportname.innerHTML = sessionStorage.getItem('firstname') + " " + sessionStorage.getItem('lastname');
            lblshowtimereport.innerHTML = sessionStorage.getItem('confirmedDate');


        }

    });
    // button show time click event
    btnshowstatus.addEventListener('click', function () {
        statusWelcomeh5.innerHTML = "Hello " + sessionStorage.getItem('firstname');
        lblempnameconfirmed.innerHTML = sessionStorage.getItem('firstname') + " " + sessionStorage.getItem('lastname');
        lblattendancetime.innerHTML = sessionStorage.getItem('confirmedDate');
        // end of button show time click event
    })
    //when user click logout 
    btnlogout.addEventListener('click', function () {
        window.location.replace("../login.html");
    });

    showreportbtn.addEventListener('click', async function () {
        lblshowtimereport.innerHTML = sessionStorage.getItem('confirmedDate');
        username = sessionStorage.getItem('username');
        await fetch(`http://localhost:3000/attendance?emp_username=${username}`).then(response => {
            return response.json();
        }).then(data => {
            //get late time
            let late = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i]['late'] == 1) { late++; }
            }
            lblLateMonthly.innerHTML = late;

            //get emp attendance times 
            lblAttendMonthly.innerHTML = data.length;

            //get total days
            let min = new Date(data[0].attendancedate);
            let max = new Date(data.pop().attendancedate);
            let total = max.getDate() - min.getDate() + 1;
            lbltotalDays.innerHTML = total;

            //get absence times
            lblAbsenceMonthly.innerHTML = total - data.length - 1;
        })
            .catch(err => {
                console.log("error....");
            });
    });

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    };


});//end of window load

