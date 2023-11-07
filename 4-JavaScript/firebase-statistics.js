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
var scores = {};
var overallScores = {};
const surveys = {};

// Removes all children from container
function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
}

// Load the list of Questions from the database into the field
function loadQuestionList(surveyDropdown) {
    surveyTitle = surveyDropdown.value;

    const parent = document.getElementById("questionDropdown");
    clearContainer(parent);

    for (const questionText of surveys[surveyTitle]["Questions"]) {
        const option = document.createElement("option");
        option.setAttribute("value", questionText);
        option.style.fontFamily = "Inter";
        option.innerHTML = questionText;
        option.style.fontStyle = "normal";
        option.style.textAlign = "center";

        parent.appendChild(option);
    }
}

// Loads survey list
async function loadSurveyList() {
    // const email = sessionStorage.getItem('email');
    const email = 'gr@t.com';

    // get parent cointainer
    const parent = document.getElementById("surveyDropdown");

    // Create a query to fetch quizzes with the specified researcher email
    const query = quizRef.where('Researcher', '==', email);

    // Execute the query
    await query.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Access the data of each matching document
            const quizData = doc.data();
            const mappedData = {};

            mappedData["Levels"] = quizData["Levels"];
            mappedData["Questions"] = quizData["Questions"];
            mappedData["Status"] = quizData["Status"];
            mappedData["Weights"] = quizData["Weights"];
            mappedData["id"] = doc.id;
            mappedData["ResponseRef"] = doc.ref.collection("Responses");

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

    loadQuestionList(parent);
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
    for (const Title in surveys) {
        if (surveys.hasOwnProperty(Title)) {

            const surveyMap = surveys[Title];
            const ResponseRef = surveyMap["ResponseRef"];

            // fetch all Responses
            await ResponseRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if ("Level" in data && "Question" in data && "score" in data && "appeared" in data) {
                        const level = data["Level"];
                        const question = data["Question"];
                        const score = data["score"] / data["appeared"];
                        // Assign to the nested map
                        scores[Title] = scores[Title] || {}; // Initialize the survey if it doesn't exist
                        scores[Title][question] = scores[Title][question] || {}; // Initialize the question if it doesn't exist
                        scores[Title][question][level] = score;// set the score
                    }
                });
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
        }        
    }

    computeOverall();
}

function computeOverall() {

}
