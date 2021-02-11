window.addEventListener('load', async function () {
    tbodyAllEmployees = document.getElementById('tbodyAllEmployees');
    tbodyfullReportTable = document.getElementById('tbodyfullReportTable');
    tbodylateReportTable = document.getElementById('tbodylateReportTable');
    tbodyemployeeBriefTable = document.getElementById('tbodyemployeeBriefTable');
    tbodyExecuseReport = document.getElementById('tbodyExecuseReport');

    //btnmanageusers and logout
    btnmanageusers = document.getElementById('btnmanageusers');
    btnlogout = document.getElementById('btnlogout');
    btnlogout.addEventListener('click', function () {
        window.location.replace("../login.html");
    });

    btnmanageusers.addEventListener('click', function () {
        window.location.replace("addnewemployee.html");
    });


    var tbodyRowCount = tbodyAllEmployees.rows.length;
    //
    let employees = await fetch(`http://localhost:3000/addedemployees`);
    let employeesData = await employees.json();

    let attendances = await fetch(`http://localhost:3000/attendance`);
    let attendancedata = await attendances.json();


    // console.log(await getLateTimes(employeesData[5]["username"]));


    let Latearr = [];
    let attendArr = [];
    let absenceArr = [];
    let TotalArr = [];

    for (m = 0; m < employeesData.length; m++) {
        Latearr.push(await getLateTimes(employeesData[m]['username']));
        attendArr.push(await getAttendanceTimes(employeesData[m]['username']));
        absenceArr.push(await getAbsenceTime(employeesData[m]['username']));
    }
    for (i = 0; i < employeesData.length; i++) {

        tbodyRowCount++;
        var newrowemp = document.createElement('tr');
        // let laty = await getLateTimes(employeesData[i]['username']);
        newrowemp.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${employeesData[i]['firstname'] + " " + employeesData[i]['lastname']}</td>
                                    <td>${attendArr[i]}</td>
                                    <td>${Latearr[i]}</td>
                                    <td>${absenceArr[i]}</td>
                                    `
        tbodyAllEmployees.appendChild(newrowemp);

        //Employee Full Data 
        var newFullReportRow = document.createElement('tr');
        newFullReportRow.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${employeesData[i]['firstname'] + " " + employeesData[i]['lastname']}</td>
                                    <td>${employeesData[i]['email']}</td>
                                    <td>${employeesData[i]['address']}</td>
                                    <td>${employeesData[i]['age']}</td>
                                    <td>${employeesData[i]['username']}</td>
                                    `
        tbodyfullReportTable.appendChild(newFullReportRow);

        //late Report
        var newLateReportRow = document.createElement('tr');
        newLateReportRow.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${employeesData[i]['firstname'] + " " + employeesData[i]['lastname']}</td>
                                    <td>${employeesData[i]['username']}</td>
                                    <td>${Latearr[i]}</td>
                                    `
        tbodylateReportTable.appendChild(newLateReportRow);

        //Employee Brief
        var newLateBriefRow = document.createElement('tr');
        newLateBriefRow.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${employeesData[i]['firstname'] + " " + employeesData[i]['lastname']}</td>
                                    <td>${attendArr[i]}</td>
                                    <td>${Latearr[i]}</td>
                                    <td>${absenceArr[i]}</td>
                                    `
        tbodyemployeeBriefTable.appendChild(newLateBriefRow);


        //Employee Execuse Report
        //Employee Brief
        var newExecuseRow = document.createElement('tr');
        newExecuseRow.innerHTML = `
                                    <th scope="row">${tbodyRowCount}</th>
                                    <td>${employeesData[i]['firstname'] + " " + employeesData[i]['lastname']}</td>
                                    <td>${employeesData[i]['username']}</td>
                                    <td>${0}</td>
                                    `
        tbodyExecuseReport.appendChild(newExecuseRow);
    }


});

async function getLateTimes(EmpUsername) {
    let late = 0
    await fetch(`http://localhost:3000/attendance?emp_username=${EmpUsername}`).then(response => {
        return response.json();
    }).then(data => {
        //get late time
        // let late = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i]['late'] == 1) { late++; }
        }
    })
        .catch(err => {
            console.log("error when getting the late time....");
        });
    return late;

}
async function getAttendanceTimes(EmpUsername) {
    let x;
    await fetch(`http://localhost:3000/attendance?emp_username=${EmpUsername}`).then(response => {
        return response.json();
    }).then(data => {

        x = data.length;
    })
        .catch(err => {
            console.log("error when getting the late time....");
        });
    return x;
}
async function getAbsenceTime(EmpUsername) {
    let absenceTimes = 0;
    await fetch(`http://localhost:3000/attendance?emp_username=${EmpUsername}`).then(response => {
        return response.json();
    }).then(data => {
        //get total days
        let min = new Date(data[0].attendancedate);
        let max = new Date(data.pop().attendancedate);
        let total = max.getDate() - min.getDate() + 1;

        //get absence times
        absenceTimes = total - data.length - 1;

    })
        .catch(err => {
            console.log("error when getting the Absence time....");
        });
    return absenceTimes;
}
