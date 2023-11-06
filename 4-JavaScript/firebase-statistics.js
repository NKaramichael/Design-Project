// Logic for the stats page
// 
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
// Initialise firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var quizRef = db.collection("Quizzes");
var metaRef = db.collection("Metadata");
var levelRef = db.collection("Levels");
var userRef = db.collection('Users');
var researcherRef = db.collection('Researchers');
var questionRef = db.collection('Questions');

// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Global Statistic variables
var questionWeights = {};
var overallScores = {};

const surveys = {};

// Load the list of Questions from the database into the field
async function loadQuestionList() {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    // get parent cointainer
    const parent = document.getElementById("dropdown");;

    // Fetch the questions array
    await ref.get().then((doc) => {
        if (doc.exists) {
            const questionList = doc.data()["Questions"];
            
            // Loop through each question key in the question list
            for (const [questionText, question] of Object.entries(questionList)) {
                if (questionList.hasOwnProperty(questionText)) {
                    const option = document.createElement("option");
                    option.setAttribute("value", questionText);
                    option.style.fontFamily = "Inter";
                    option.innerHTML = questionText;
                    option.style.fontStyle = "normal";
                    option.style.textAlign = "center";

                    parent.appendChild(option);
                    questionMap.set(questionText, {});
                    questionWeights.set(questionText, question["Weight"]);
                    questionTextArray.push(questionText);
                }
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    console.log(questionWeights);
}

// Loads survey list
async function loadSurveyList() {
    const email = sessionStorage.getItem('email');

    // get parent cointainer
    const parent = document.getElementById("dropdown");

    // Create a query to fetch quizzes with the specified researcher email
    const query = quizRef.where('Researcher', '==', email);

    // Execute the query
    query.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Access the data of each matching document
            const quizData = doc.data();
            const mappedData = {};

            mappedData["Levels"] = quizData["Levels"];
            mappedData["Questions"] = quizData["Questions"];
            mappedData["Status"] = quizData["Status"];
            mappedData["Weights"] = quizData["Weights"];

            surveys[quizData["Title"]] = mappedData;

            const option = document.createElement("option");
            option.setAttribute("value", quizData["Title"]);
            option.style.fontFamily = "Inter";
            option.innerHTML = quizData["Title"];
            option.style.fontStyle = "normal";
            option.style.textAlign = "center";

            parent.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error getting quizzes:', error);
    });


}

async function updateScoreTable() {

}

async function updateMetaTable() {

}

// INCOMPLETE precompute/fetch all stats onload
async function computeGlobalStatistics() {
    await levelRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // get the appeared and score arrays
            const level = doc.id;
            const researcher = doc.researcher;
            const appearedMap = doc.appeared;
            const scoreMap = doc.score;

            // Set the score
            const score = new Map();
            for (const [questionText, value] of Object.entries(scoreMap)) {
                score.set(questionText, value);
            }
            for (const [questionText, value] of Object.entries(appearedMap)) {
                if (score.has(questionText)) {
                    score.set(questionText, score.get(questionText)/value);
                } else {
                    console.log("Warning: Level appeared but was never scored");
                }
            }

            // Sort the values into the global maps
            
        });
    })
    .catch((error) => {
        console.error('Error getting documents: ', error);
    });
}

async function computeStatistics() {

}