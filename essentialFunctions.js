//checks if email is a valid format
function validate_email(email){
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email) == true;
};

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
};

function submitLogin(e) {
  e.preventDefault();

  //get the values put into the form using getElementval and store in var's.
  var email = getElementVal('email');
  var password = getElementVal('password');

  // Query the database to see if the email is already in use
};

// Gets element value from document
const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// returns session stored password
function displayP() {
  return sessionStorage.getItem("password")
};

// returns session stored email
function displayE() {
  return sessionStorage.getItem("email")
};

// Returns list of emails
function getEmails() {
  return [
    'ex1@ex.com',
    'ex2@ex.com',
    'ex3@ex.com'
  ];
}

// Fetches all passwords
function getPasswords() {
  return ['p1','p2','p3'];
}

// Changes pages
function changePage(currentPage, newPage) {
  return newPage;
}

// Checks user's role
function checkRole(userRole) {
  return userRole === 'admin';
}

// Function to change a user's role to a new role
function changeRole(currentUserRole, newRole) {
  return newRole;
}

// Function to change a user's password
function changePassword(currentPassword, newPassword) {
  return newPassword;
}

// Checks for unique survey ID
function checkSurveyID_unique(n) {
  if (n < 1) {
    throw new Error('Invalid argument: n must be a positive integer');
  } else if (n <= 2) {
    return 1;
  } else {
    let surveyID = 1;
    let surveyIDtoBeChecked = 1;
    for (let i = 3; i <= n; i++) {
      let next = surveyID + surveyIDtoBeChecked;
      surveyID = surveyIDtoBeChecked;
      surveyIDtoBeChecked = next;
    }
    return surveyIDtoBeChecked;
  }
}

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

const getData = (heading, desc, refArr, imgRefArr) => {
  var data = {
    Title: heading,
    Description: desc,
    Status: true,
    Questions: refArr,
    Images: imgRefArr
  };

  return data;
}

module.exports = { validate_email, validate_password, getEmails, getPasswords, changePage, 
  checkRole, changeRole, changePassword, checkSurveyID_unique, getData};