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

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function displayP() {
  return sessionStorage.getItem("password")
};

function displayE() {
  return sessionStorage.getItem("email")
};

function getEmails() {
  return [
    'example1@example.com',
    'example2@example.com',
    'example3@example.com'
  ];
}

function getPasswords() {
  return ['password1', 'password2', 'password3'];
}

function changePage(currentPage, newPage) {
  return newPage;
}

function checkRole(userRole) {
  return userRole === 'admin';
}

function changeRole(currentUserRole, newRole) {
  return newRole;
}

function changePassword(currentPassword, newPassword) {
  return newPassword;
}

function checkSurveyID_unique(n) {
  if (n < 1) {
    throw new Error('Invalid argument: n must be a positive integer');
  } else if (n <= 2) {
    return 1;
  } else {
    let prev = 1;
    let curr = 1;
    for (let i = 3; i <= n; i++) {
      let next = prev + curr;
      prev = curr;
      curr = next;
    }
    return curr;
  }
}


module.exports = { validate_email, validate_password, getEmails, getPasswords, changePage, checkRole, changeRole, changePassword, checkSurveyID_unique};