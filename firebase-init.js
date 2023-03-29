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

    var email = getElementVal('email');
    var password = getElementVal('password');
    var role = '';
    var checkbox = document.getElementById('role');
  
    if(checkbox.checked){
      role = "Researcher";
    }
    else{
      role = "User";
    }


    saveMessages(email,password,role);

    
  }

  const saveMessages = (email,password,role) => {
    var newContactForm = contactFormDB.push();

    newContactForm.set({
      email : email,
      password : password,
      role : role,
    });

  };

  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };
