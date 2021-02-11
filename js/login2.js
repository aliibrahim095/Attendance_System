
window.addEventListener('load', function () {
    username = document.getElementById('username');
    password = document.getElementById('password');
});


async function loginFun() {
    let flag = 0;
    let firstname;
    let lastname;
    let empusername;

    if (username.value == "ali1234" && password.value == "ali1234") {
        //if the user is the admin
        window.location.replace("html/admindashboard.html");
    }

    else {

        await fetch('http://localhost:3000/addedemployees').then(response => {
            return response.json();
        }).then(data => {
            for (i = 0; i < data.length; i++) {
                if (username.value == data[i]['username'] && password.value == data[i]['password']) {
                    //redirect to empProfile
                    firstname = data[i]['firstname'];
                    lastname = data[i]['lastname'];
                    empusername = data[i]['username'];
                    flag = 1;
                    break;
                }
            }
            if (flag == 1) {

                sessionStorage.setItem('status', 'loggedIn');
                sessionStorage.setItem("firstname", firstname);
                sessionStorage.setItem("lastname", lastname);
                sessionStorage.setItem("username", empusername);
                window.location.replace("html/emprofile.html");
            }
            else {
                // error login
                alert("enter correct data");

            }
        })
            .catch(err => {
                alert("check json server is runing" + err);
            });
    }
}
