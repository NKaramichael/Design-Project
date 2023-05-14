
// function submit(){
//     submitQuiz

//     window.location.href = "./currentResearcherBoard.html"
// }

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

    const files = document.getElementById('fileInput').files;
    var process = true;
    var errorOutput = "Address the following issues: \n";
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

    var questionList = document.getElementById('questionList');
    var questions = questionList.getElementsByTagName('li');

    // Iterate through the items
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        // Do something with each item (e.g., retrieve text content)
        console.log(question.textContent);
    }

    // Submit Questions & details to questions table in database

    // Submit Quiz as a whole with reference to images and questions to Quiz table in database
}