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

// Gloabal Statistic variables
var questionMap = new Map();
var questionWeights = new Map();
var questionTextArray = [];

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
                    questionMap.set(questionText, []);
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

async function updateScoreTable() {

}

async function updateMetaTable() {

}

// precompute/fetch all stats onload
async function computeStatistics() {
    await levelRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // get the appeared and score arrays
            const appearedArray = doc.appeared;
            const scoreArray = doc.score;

            var score = new Map();
            for (const question of scoreArray) {
                score = Map(question);
            }
            for (const question of appearedArray) {
                score;
            }

            
        });
    })
    .catch((error) => {
        console.error('Error getting documents: ', error);
    });
}
