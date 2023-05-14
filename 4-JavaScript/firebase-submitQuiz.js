const firebaseConfig = {
    apiKey: "AIzaSyDPhBs6YrLXQspg8krTemU6WdlArx4lNQ4",
    authDomain: "pcgevaluation-49d75.firebaseapp.com",
    databaseURL: "https://pcgevaluation-49d75-default-rtdb.firebaseio.com",
    projectId: "pcgevaluation-49d75",
    storageBucket: "pcgevaluation-49d75.appspot.com",
    messagingSenderId: "369543877095",
    appId: "1:369543877095:web:84e7d5c5fdb84dd72eed42"
  };
  
// Initialise firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var collectionRef = db.collection("Questions");

function submitQuiz(){
    document.getElementById('submitQuizForm').addEventListener('submit', submit);
}

function change(num){

    let out = '';
    switch (num){
        case 0: out = 'A';
        break;
        case 1: out = 'B';
        break;
        case 2: out = 'C';
        break;
    }

    return out;
}

// Function to submit the quiz to the quiz database, the questions to the question database and the images to the level database
function submit(e){
    e.preventDefault();

    // Checking that user has uploaded at least one image
    const files = document.getElementById('fileInput').files;

    if (files.length == 0){
        alert("Pee pee poo poo upload image");
        return;
    }

    // Checking that heading and description are filled in
    const heading = document.getElementById('heading').value;
    const desc = document.getElementById('description').value;
    var process = true;
    var errorOutput = "Address the following issues: \n";

    if (heading == ""){
        errorOutput += "Please enter a Quiz heading\n";
        process = false;
    }
    if (desc == ""){
        errorOutput += "Please enter a Quiz description\n";
        process = false;
    }

    if (process == false){
        alert(errorOutput);
        return;
    }
    
    process = true;
    errorOutput = "Address the following issues: \n";
    var imageArr = [];

    // Submit Images(Levels) & metadata to levels table in database
    for (let i = 0; i < files.length; i++) {
        const details = new Map();

        // Fetching the selected value from model dropdown
        var selectModel = 'model';
        selectModel += i;
        const selectM = document.getElementById(selectModel);
        const valueM = selectM.value;

        if (valueM === 'none') {
            errorOutput += "Please select a valid model type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("model", valueM);
        }

        // Fetching the selected value from domain dropdown
        var selectDomain = 'domain';
        selectDomain += i;
        const selectD = document.getElementById(selectDomain);
        const valueD = selectD.value;

        if (valueD === 'none') {
            errorOutput += "Please select a valid domain type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("domain", valueD);
        }

        imageArr.push(details);
    }
    
    if (process == false){
        alert(errorOutput);
        return;
    }

    // Submit Questions & details to questions table in database
    var questionList = document.getElementById('questionList');
    var questions = questionList.getElementsByTagName('li');

    if (questions.length == 0){
        alert("Cannot create quiz with no questions!");
        return;
    }

    // Iterate through the items
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        // Do something with each item (e.g., retrieve text content)
        var description = question.textContent.split("|")[0].trim();
        var type = question.textContent.split("|")[1].trim();

        var data = {
            Description: description,
            Type: type,
          };
        
        // collectionRef.add(data)
        // .then(function(docRef) {
        // console.log("Document written with ID: ", docRef.id);
        // })
        // .catch(function(error) {
        // console.error("Error adding document: ", error);
        // });
    }

    // Submit Quiz as a whole with reference to images and questions to Quiz table in database
}