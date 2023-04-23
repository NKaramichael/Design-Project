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

// Submits changed password to the database and replaces the current password
function submitChangePassword(e) {
  e.preventDefault();
  var newPassword = getElementVal('password'); //Find the password of the current user through their session info
  var email = sessionStorage.getItem('email');

  // Validate password is of the correct form
  let outputPass = "Invalid password. Address the following:"
  let passError = false
  let passwordValidationArr = validate_password(newPassword);
 
  if (!passwordValidationArr[0]) {
    passError = true
    outputPass += "\n- Password is not 8 characters long"
  }
  if (!passwordValidationArr[1]) {
    passError = true
    outputPass += "\n- Password does not contain a lower case letter"
  }
  if (!passwordValidationArr[2]) {
    passError = true
    outputPass += "\n- Password does not contain a capital letter"
  }
  if (!passwordValidationArr[3]) {
    passError = true
    outputPass += "\n- Password does not contain a number"
  }

  if (passError) {
    alert(outputPass); //Alert error if its not in the correct form
  }
  else{ //Update it in the database if it is of the correct form
    return true;
  }

}

function submitLogin(e) {
  e.preventDefault();

  //get the values put into the form using getElementval and store in var's.
  var email = getElementVal('email');
  var password = getElementVal('password');

  // Query the database to see if the email is already in use
  
}

//The main signup method
function submitSignUp(e) {
  e.preventDefault();

  //get the values put into the form using getElementval and store in var's.
  var email = getElementVal('email');
  var password = getElementVal('password');
  var role = '';
  var checkbox = document.getElementById('role');

  //sets role based on the state of the checkbox
  if (checkbox.checked) {
    role = "Researcher";
  }
  else {
    role = "User";
  }

  //verify that email and password are in correct format
  let outputPass = "Invalid password. Address the following:"
  let passError = false
  let outputEmail = ""
  let emailError = false
  let passwordValidationArr = validate_password(password);
  if (!validate_email(email)) {
    emailError = true
    outputEmail += "Invalid email. Ensure your email is of a valid domain and that it has not been used to create an account before"
  }
  if (!passwordValidationArr[0]) {
    passError = true
    outputPass += "\n- Password is not 8 characters long"
  }
  if (!passwordValidationArr[1]) {
    passError = true
    outputPass += "\n- Password does not contain a lower case letter"
  }
  if (!passwordValidationArr[2]) {
    passError = true
    outputPass += "\n- Password does not contain a capital letter"
  }
  if (!passwordValidationArr[3]) {
    passError = true
    outputPass += "\n- Password does not contain a number"
  }

  //alert("signing up with these details: " + "\n" + email + "\n" + password + "\n" + role)
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