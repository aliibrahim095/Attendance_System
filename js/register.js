window.addEventListener('load', function () {
    firstname = document.getElementById('firstname');
    lastname = document.getElementById('lastname');
    address = document.getElementById('address');
    email = document.getElementById('email');
    age = document.getElementById('age');
    btnsubmit = document.getElementById('btnsubmit');
    btnsubmit.addEventListener('click', function () {

        IDRandom = Number(generateRandomkey(6));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/users", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "firstname": firstname.value,
            "lastname": lastname.value,
            "address": address.value,
            "email": email.value,
            "age": age.value
            , "id": IDRandom
        }));
        window.location.replace("../login.html");
    });
});

function generateRandomkey(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}