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

  module.exports = { validate_email, validate_password };