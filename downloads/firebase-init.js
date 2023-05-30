// This document handles account queries such as signup/login/change username/change password
//configuration for connecting to firebase database
const firebaseConfig = {
  apiKey: "AIzaSyDPhBs6YrLXQspg8krTemU6WdlArx4lNQ4",
  authDomain: "pcgevaluation-49d75.firebaseapp.com",
  databaseURL: "https://pcgevaluation-49d75-default-rtdb.firebaseio.com",
  projectId: "pcgevaluation-49d75",
  storageBucket: "pcgevaluation-49d75.appspot.com",
  messagingSenderId: "369543877095",
  appId: "1:369543877095:web:84e7d5c5fdb84dd72eed42"
};

//initialise firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//create reference for DB
var contactFormDB = firebase.database().ref('contactForm')

//create reference for firestore collections
var UserFirestore = db.collection('Users');
var ResearcherFirestore = db.collection('Researchers');
UserFirestore.doc("initializer").set({});
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
    outputPass += "\n- Password is not between 8 and 32 characters"
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
  firebase.database().ref("contactForm").orderByChild("email").equalTo(email).once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();

      // update the password value of the node with the matching email address
      var updates = {
        password: newPassword
      }

      firebase.database().ref("contactForm/" + childKey).update(updates);
      alert("Password Successfully Changed!");
      if (sessionStorage.getItem('role') == "Researcher") {
        sessionStorage.setItem('password', newPassword);
        window.location.replace("../2-ResearcherPages/currentResearcherBoard.html");
      }
      else {
        sessionStorage.setItem('password', newPassword);
        window.location.replace("../3-UserPages/currentUserBoard.html");
      }
    });
  });
}

}

function submitLogin(e) {
  e.preventDefault();

  //get the values put into the form using getElementval and store in var's.
  var email = getElementVal('email');
  var password = getElementVal('password');

  // Query the database to see if the email is already in use
  contactFormDB.orderByChild("email").equalTo(email).once("value", (snapshot) => {
    if (snapshot.exists()) {
      // The email exists in the database, check if the password matches
      snapshot.forEach((user) => {
        const userData = user.val();
        if (userData.password === password) {
          // The password matches, log the user in
          sendToDash(userData.email, userData.role);
        } else {
          // The password doesn't match, show an error message
          alert("Incorrect password!");
        }
      });
    } else {
      // The email is not in use
      alert("Email is not registered!");
    }
  });
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
    outputEmail += "Invalid email. Ensure your email is of a valid domain and that it has not been used to create an account before. Also, make sure your email is less than 50 characters long"
  }
  if (!passwordValidationArr[0]) {
    passError = true
    outputPass += "\n- Password is not between 8 and 32 characters"
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
  contactFormDB.orderByChild("email").equalTo(email).once("value", (snapshot) => {
    if (snapshot.exists()) {
      // The email is already in use
      alert("Email is already in use!");
    } else if (emailError && passError) {
      alert(outputEmail + ".\n\n" + outputPass)
    } else if (emailError && !passError) {
      alert(outputEmail)
    } else if (!emailError && passError) {
      alert(outputPass)
    } else {
      //Request that the data is saved in the Database using the saveMessage function.
      saveMessages(email, password, role);
    }
  });
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
    window.location.replace("../2-ResearcherPages/currentResearcherBoard.html");
  }
  else {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('role', role);
    window.location.replace("../3-UserPages/currentUserBoard.html");
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
  
  if (role == 'User') {
    UserFirestore.doc(email).set({
      completedQuizzes: [],currentQuizzes: [] });
  }
  else if (role == 'Researcher') {
    ResearcherFirestore.doc(email).set({
      mySurveys: [] });
  };

  // create user/researcher document copy in firestore
  if (role == 'User') {
    UserFirestore.doc(email).set({
      completedQuizzes: [],currentQuizzes: [] });
  }
  else if (role == 'Researcher') {
    ResearcherFirestore.doc(email).set({
      mySurveys: [] });
  };

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
    window.location.replace("../2-ResearcherPages/currentResearcherBoard.html");
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
    window.location.replace("../3-UserPages/currentUserBoard.html");
  }

};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

//checks if email is a valid format
function validate_email(email) {
  let valid = false;
  if (email.length <= 50){
    valid = true;
  }
  let expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return (expression.test(email) == true && valid);
}

//checks if password is longer than 7 characters and up to 32, and has at least one capital letter and number
function validate_password(password) {
  let lengthValid = false;

  if (password.length >= 8 && password.length <= 32) {
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