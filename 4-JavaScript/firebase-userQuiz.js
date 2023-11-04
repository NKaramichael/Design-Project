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
var quizRef = db.collection("Quizzes");
var metaRef = db.collection("Metadata");
var levelRef = db.collection("Levels");
var userRef = db.collection('Users');
var researcherRef = db.collection('Researchers');
var questionRef = db.collection('Questions');

// QUIZ DATA
var researcher;
var questionList = [];

async function displayImages(data) {
    // Get a reference to the parent container element
    const parentContainer = document.getElementById('imageContainer');

// Create the outer row element
const rowElement = document.createElement("div");
rowElement.classList.add("row", "justify-content-center", "align-items-center");

// Define an async function to be used inside the forEach loop
const loadImage = async (levelName) => {
    // Create the column element
    const col = document.createElement("div");
    col.classList.add("col");

    // Create the image element
    const image = document.createElement("img");
    image.classList.add("img-fluid");
    image.style.maxWidth = "300px";
    image.style.maxHeight = "300px";
    image.style.boxShadow = "2px 2px #000";

    const url = await getLevelUrl(levelName);
    image.setAttribute("src", url)

    col.appendChild(image);
    rowElement.appendChild(col);
};

// Iterate over the image names and load them asynchronously
for (const levelName of data['Images']) {
    await loadImage(levelName);
}

parentContainer.appendChild(rowElement);
};

async function displayHeading(heading) {
    // Get a reference to the parent container element
    const headerContainer = document.getElementById("surveyHeading");

headerContainer.innerHTML = heading;
};

async function displayDescription(description) {
    // Get a reference to the parent container element
    const headerContainer = document.getElementById("imageContainer");

headerContainer.innerHTML = description;
};

function Previous() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

}

function Next() {

    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    prevButton.style.display = "block"; //Unhide previous when not on survey "main page"

}

async function openSurvey() {
// Get the quizId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const quizID = urlParams.get('quizId');

const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

prevButton.style.display = "none"; // hide previous button in survey "main page"

prevButton.setAttribute(onclick, "Previous(this)");
nextButton.setAttribute(onclick, "Next(this)");

quizDoc = quizRef.doc(quizID)
await quizDoc.get()
    .then((doc) => {
    if (doc.exists) {
        displayHeading(doc.data()["Title"]);
        displayDescription(doc.data()["Description"]);
        loadQuestionList(doc.data()["Questions"], doc.data()["Levels"]);
        console.log(questionList);
    } else {
        // The document doesn't exist
        console.log("No such document!");
    }
    })
    .catch((error) => {
    // An error occurred while retrieving the document
    console.log("Error getting document:", error);
    });
};

async function submit() {
const email = sessionStorage.getItem("email");

// Get the quizId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizId');

await userRef.doc(email).update({
    currentQuizzes: firebase.firestore.FieldValue.arrayRemove(quizId),
    completedQuizzes: firebase.firestore.FieldValue.arrayUnion(quizId)
});

window.location.href = "./completedUserBoard.html"
};

async function loadQuestionList(questions, levels) {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    await ref.get().then((doc) => {
        if (doc.exists) {
            const allQuestions = doc.data()["Questions"];
            // loop through array and get info for each quiz to display
            
            allQuestions.forEach((question, index) => {
                if (index in questions) {
                    questionList.push(
                        new Map([
                        ["questionID", index],
                        ["questionText", question["QuestionText"]],
                        ["questionType", question["QuestionType"]],
                        ["multi-Image", question["multi-Image"]]
                        ])
                    );
                }
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    const pickedImages = new Set();
    
    questionList.forEach((question) => {
        if (levels.length != 0) {
            numImages = 1;

            const min = 2;
            const max = 6;

            //  set random number of images for multi question
            if (question["multi-Image"] == "true") {
                numImages = Math.floor(Math.random() * (max - min + 1)) + min;
            }

            questionLevels = [];
            // get random images from pool and add to container
            for (let i = 0; i < numImages; i++) {
                const imageIndex = pickRandomImage(levels, pickedImages);
                
                questionLevels.push(levels[imageIndex]);
            }

            question.set("levels", questionLevels);
        }
    });
    
}

// Function to pick a random image from the pool
function pickRandomImage(imagePool, pickedImages) {
    // Check if all items have been picked
    if (pickedImages.size === imagePool.length) {
        // Reset the Set
        pickedImages.clear();
    }

    let randomIndex;

    do {
        // Generate a random index within the range of available items
        randomIndex = Math.floor(Math.random() * imagePool.length);
    } while (pickedImages.has(randomIndex));

    // Mark the item as picked
    pickedImages.add(randomIndex);

    return randomIndex;
}