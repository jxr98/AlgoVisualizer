import {User} from "./lib/User.js"
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("signInSignUp");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// sign in/ sign up form
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});
signupLink.onclick = (() => {
    signupBtn.click();
    return false;
});


document.getElementById("signupButton").onclick = function () {
    if ($('#signupPassword').val() === $('#signupConfirmPassword').val()) {
        var user = new User($('#signupName').val(), $('#signupEmail').val());
        user.setPassword($('#signupPassword').val());
        var data = {"name": user.getName(), "email": user.getEmail(), "password": user.getPassword()};
        $.ajax({
            type: "POST",
            url: "http://155.138.156.192:8080/users/signup",
            dataType: "json",
            data: data,
            success: function () {
                loginBtn.click();
                window.alert("user created!");
            }
        })
    } else {
        $('#message').html("Passwords do not match!");
    }
}

document.getElementById("loginButton").onclick = function () {
    var user = new User();
    user.setEmail($('#loginEmail').val());
    user.setPassword($('#loginPassword').val());
    var data = {"email": user.getEmail(), "password": user.getPassword()};
    $.ajax({
        type: "POST",
        url: "http://155.138.156.192:8080/users/signin",
        dataType: "json",
        data: data,
        success: function (user) {
            window.alert("user signed in");
            var cookie="id="+user.id+"; " + "email"+ user.email;
            document.cookie=cookie;
        }
    })
}