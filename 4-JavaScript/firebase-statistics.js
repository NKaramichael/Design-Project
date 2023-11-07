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
var surveys = {};
var levelInfo = {};

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

    updateScoreTable();
}

// Update the score table on change of dropdown
async function updateScoreTable() {
    const question = document.getElementById("questionDropdown").value;
    const Title = document.getElementById("surveyDropdown").value;
    const imageList = document.getElementById("imageList");
    const levelsToDisplay = scores[Title] && scores[Title][question];

    // clear the container
    clearContainer(imageList);

    if (levelsToDisplay) {
        imageList.innerHTML = "";

        // Fetch the content of level-card.html once
        fetch("https://nkaramichael.github.io/Design-Project/New%20UI/components/level-card.html")
        .then((response) => response.text())
        .then((html) => {
            // loop through the levels
            for (const level in levelsToDisplay) {
                if (levelsToDisplay.hasOwnProperty(level)) {
                    // Create a new DOM element with the fetched content
                    const template = document.createElement('template');
                    template.innerHTML = html;

                    // Modify the content inside the element for this iteration
                    const levelImage = template.content.querySelector('.level-card-image');
                    const scoreValue = template.content.querySelector('#scoreValue');
                    const domainValue = template.content.querySelector('#domainValue');
                    const modelValue = template.content.querySelector('#modelValue');

                    // Set values for the elements by looking up the maps
                    levelImage.src = levelInfo[level]["imageUrl"];
                    modelValue.innerText = levelInfo[level]["model"];
                    domainValue.innerText = levelInfo[level]["domain"];
                    scoreValue.innerText = scores[Title][question][level];
                    
                    // Set a unique id for the level-card element
                    const uniqueId = level;
                    template.content.querySelector('.level-card-parent-div').id = uniqueId;

                    // Add the modified element to your container
                    imageList.appendChild(template.content);
                }
            }
            
        })
        .catch((error) => {
            console.error("Error loading content:", error);
        });
    } else {
        imageList.innerHTML = "No data to display :(";
    }
}

// Update the meta table
function updateMetaTable() {

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

    // compute the statistics
    await computeStatistics();
    // fetch level urls
    await fetchLevelInfo();

    loadQuestionList(parent);
}

async function fetchLevelInfo() {
    levelSet = new Set();
    for (const Title in surveys) {
        if (surveys.hasOwnProperty(Title)) {
            // add levels to the set
            surveys[Title]["Levels"].forEach((item) => {
                levelSet.add(item);
              });
        }
    }

    //  Split the IDs into smaller arrays
    const idChunks = [];
    const chunkSize = 10;
    const ids = Array.from(levelSet);
    for (let i = 0; i < ids.length; i += chunkSize) {
        idChunks.push(ids.slice(i, i + chunkSize));
    }
    
    const fetchPromises = Array.from(levelSet).map(docID => {
        const docRef = levelRef.doc(docID);
        return docRef.get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const imageUrl = data["imageUrl"];
                    const domain = data["domain"];
                    const model = data["model"];

                    levelInfo[docID] = {};
                    levelInfo[docID]["imageUrl"] = imageUrl;
                    levelInfo[docID]["domain"] = domain;
                    levelInfo[docID]["model"] = model;
                }
            })
            .catch(error => {
                console.error(`Error fetching document ${docID}: `, error);
            });
    });
    
    await Promise.all(fetchPromises)
        .then(() => {
            // levelUrls now contains document IDs and their corresponding URLs
            console.log(levelInfo);
        })
        .catch(error => {
            console.error("Error fetching documents: ", error);
        });
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
                         // Initialize the survey if it doesn't exist
                        scores[Title] = scores[Title] || {}; 
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
