//checks if email is a valid format
function validate_email(email){
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email) == true;
  }

  //checks if password is longer than 7 characters, and has at least one capital letter and number
  function validate_password(password){
    let lengthValid = false;

    if (password.length >= 8){
      lengthValid = true;
    }

    // check if the password contains at least one lowercase letter
    const hasLowerCaseLetter = /[a-z]/.test(password);

    // check if the password contains at least one capital letter
    const hasCapitalLetter = /[A-Z]/.test(password);

    // check if the password contains at least one number
    const hasNumber = /\d/.test(password);

    return [lengthValid, hasLowerCaseLetter, hasCapitalLetter, hasNumber];
  }

//listen to if the signup button is pressed or login button, redirect to respective methods
function signUp() {
  document.getElementById('signupForm').addEventListener('submit', submitSignUp);
}

function login() {
  document.getElementById('loginForm').addEventListener('submit', submitLogin);
}

// Listen to if form button submitChangePassword and change them in the database
function changePassword() {
  document.getElementById('Form').addEventListener('submit', submitChangePassword);
}

function submitLogin(e) {
  e.preventDefault();

  //get the values put into the form using getElementval and store in var's.
  var email = getElementVal('email');
  var password = getElementVal('password');

  // Query the database to see if the email is already in use
  
}

const sendToDash = (email, role) => {
  //Redirecting visitor to their specific GUI dashboard based on "Researcher" or "User".
  if (role == "Researcher") {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('role', role);
    window.location.replace("./currentResearcherBoard.html");
  }
  else {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('role', role);
    window.location.replace("./newUserBoard.html");
  }

};

//add user credentials to firebase database
const saveMessages = (email, password, role) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    email: email,
    password: password,
    role: role,
  });

  //Redirecting visitor to their specific GUI dashboard based on "Researcher" or "User".
  if (role == "Researcher") {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('role');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value
    

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('role', role);
    window.location.replace("./currentResearcherBoard.html");
  }
  else {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('role');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('role', role);
    window.location.replace("./newUserBoard.html");
  }

};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

//Code to display email and password in profile
function displayE() {
  return sessionStorage.getItem("email")
}

function displayP() {
  return sessionStorage.getItem("password")
}

function account() {
  var myDiv1 = document.getElementById("email");
  var myDiv2 = document.getElementById("password");
  if (myDiv1.textContent != "" && myDiv2.textContent != "") {
    myDiv1.textContent = "";
    myDiv2.textContent = "";
    var Div3 = document.getElementById("AccountBtn");
    Div3.textContent = "View Account Details"
  } else {
    var myDiv1 = document.getElementById("email");
    mail = displayE();
    myDiv1.textContent = mail;
    var myDiv2 = document.getElementById("password");
    pass = displayP();
    myDiv2.textContent = pass;
    var Div3 = document.getElementById("AccountBtn");
    Div3.textContent = "Hide Account Details"
  }
}

  module.exports = { validate_email, validate_password };