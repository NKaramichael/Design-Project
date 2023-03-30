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
    if(validate_email(email)==false || validate_password(password)==false){
      alert('Please make sure your email is the in correct format and your password is longer than 6 characters')
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
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true){
      return true;
    }
    else{
      return false;
    }
  }

    //checks if password is longer than 6 characters
    function validate_password(password){
        if (password.length < 6){
          return false;
        }
        else{
          return true;
        }
    }
