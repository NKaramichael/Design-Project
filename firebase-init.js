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

  //create reference for DB
  var contactFormDB = firebase.database().ref('contactForm')

  //listen to if the signup button is pressed or login button, redirect to respective methods
  function signUp(){
    document.getElementById('signupForm').addEventListener('submit', submitSignUp);
  }

  function login(){
    document.getElementById('loginForm').addEventListener('submit', submitLogin);
  }

  function submitLogin(e){
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
            sendToDash(userData.email,userData.role);
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
  function submitSignUp(e){
    e.preventDefault();

    //get the values put into the form using getElementval and store in var's.
    var email = getElementVal('email');
    var password = getElementVal('password');
    var role = '';
    var checkbox = document.getElementById('role');

    //sets role based on the state of the checkbox
    if(checkbox.checked){
      role = "Researcher";
    }
    else{
      role = "User";
    }

    //verify that email and password are in correct format
    let outputPass = "Invalid password. Address the following:"
    let passError = false
    let outputEmail = ""
    let emailError = false
    let passwordValidationArr = validate_password(password);
    if(!validate_email(email)){
      emailError = true
      outputEmail += "Invalid email. Ensure your email is of a valid domain and that it has not been used to create an account before"
    }
    if (!passwordValidationArr[0]){
      passError = true
      outputPass += "\n- Password is not 8 characters long"
    }
    if (!passwordValidationArr[1]){
      passError = true
      outputPass += "\n- Password does not contain a lower case letter"
    }
    if (!passwordValidationArr[2]){
      passError = true
      outputPass += "\n- Password does not contain a capital letter"
    }
    if (!passwordValidationArr[3]){
      passError = true
      outputPass += "\n- Password does not contain a number"
    }
    
    //alert("signing up with these details: " + "\n" + email + "\n" + password + "\n" + role)
    // Query the database to see if the email is already in use
    contactFormDB.orderByChild("email").equalTo(email).once("value", (snapshot) => {
      if (snapshot.exists()) {
        // The email is already in use
        alert("Email is already in use!");
      } else if (emailError && passError){
        alert(outputEmail + ".\n\n" + outputPass)
      } else if (emailError && !passError){
        alert(outputEmail)
      } else if (!emailError && passError){
        alert(outputPass)
      } else {
        //Request that the data is saved in the Database using the saveMessage function.
        saveMessages(email,password,role);
      }
    });
  }

  const sendToDash = (email,role) => {
    //Redirecting visitor to their specific GUI dashboard based on "Researcher" or "User".
    if(role == "Researcher"){
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('password');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      window.location.replace("./researcherBoard.html");
    }
    else{
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('password');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      window.location.replace("./newUserBoard.html");
    }
    
  };

  //add user credentials to firebase database
  const saveMessages = (email,password,role) => {
    var newContactForm = contactFormDB.push();
    
    newContactForm.set({
      email : email,
      password : password,
      role : role,
    });
    
    //Redirecting visitor to their specific GUI dashboard based on "Researcher" or "User".
    if(role == "Researcher"){
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('password');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      window.location.replace("./researcherBoard.html");
    }
    else{
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('password');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      window.location.replace("./newUserBoard.html");
    }
    
  };

  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };

