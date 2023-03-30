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
  var contactFormDB = firebase.database().ref('contactForm');

  document.getElementById('contactForm').addEventListener('submit', submitForm);

  function submitForm(e){
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
      outputEmail += "Invalid email. Ensure your email is of a valid domain"
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

    if (emailError && passError){
      alert(outputEmail + ".\n\n" + outputPass)
      return
    } else if (emailError && !passError){
      alert(outputEmail)
      return
    } else if (!emailError && passError){
      alert(outputPass)
      return
    }
    
    //Request that the data is saved in the Database using the saveMessage function.
    saveMessages(email,password,role);
  }

  const saveMessages = (email,password,role) => {
    var newContactForm = contactFormDB.push();

    newContactForm.set({
      email : email,
      password : password,
      role : role,
    });
    
    //Redirecting visitor to their specific GUI dashboard based on "Researcher" or "User".
    if(role == "Researcher"){
      window.location.replace("./researcherDashboard.html");
    }
    else{
      window.location.replace("./userDashboard.html");
    }
    
  };

  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };

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
