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

const noDataMessage = "Oops... No data available. Check back later to see if anyone has answered your survey.";

// Global Statistic variables
const scores = {};
const overallScores = {};
const surveys = {};
const levelInfo = {};
const averageScores = {};

// Colour declarations
const colourRed = 'red';
const colourOrange = 'orange';
const colourYellow = 'yellow';
const colourGreen  = 'green';

// Placeholder option for survey dropdown
var removedPlaceholder = false;

// Add an event listener to check for overflow on window resize
window.addEventListener('resize', resize);
function resize() {if (removedPlaceholder) document.getElementById("hero").style.height = '100vh';}

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
    parent.disabled = true;

    if (surveyTitle == "none" && surveyDropdown.querySelector('option[data-special="true"]')) {
        parent.style.display = "none";
        return;
    } else {
        parent.style.display = "flex";

        const children = surveyDropdown.children;

        if (!removedPlaceholder) {
            removedPlaceholder = true;
            surveyDropdown.removeChild(children[0]);
        }
        
        document.getElementById("bottomContainer").style.display = "flex";
        document.getElementById("stepsContainer").style.display = "none";
    }

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

    // add overall option to dropdown list (must be done after all stats are computed)
    const option = document.createElement("option");
    option.setAttribute("value", "Overall Statistics"); // just a unique value that no quiz can be named 
    option.setAttribute("data-special", true); // to identify the Overall Statistics option, in case some mad person names a survey "Overall Statistics" 
    option.style.fontFamily = "Inter";
    option.innerHTML = "Overall Statistics";
    option.style.fontStyle = "normal";
    option.style.textAlign = "center";

    parent.appendChild(option);

    parent.disabled = false;
}

// Update the score table on change of dropdown
function updateScoreTable() {
    const questionDropdown = document.getElementById("questionDropdown");
    const question = questionDropdown.value;
    const Title = document.getElementById("surveyDropdown").value;

    if (question === "Overall Statistics" && questionDropdown.querySelector('option[data-special="true"]')) {
        // Handle "Overall Statistics" option
        displayOverall();
        return;
    }
    
    const imageList = document.getElementById("imageList");
    const levelsToDisplay = scores[Title] && scores[Title][question];
    
    // clear the container
    clearContainer(imageList);

    if (levelsToDisplay) {
        updateMetaTable(levelsToDisplay);
        imageList.innerHTML = "";

        // Create an array to store the level keys and their corresponding values
        const levelKeysAndValues = [];

        // Populate the array with level keys and values
        for (const level in levelsToDisplay) {
            const levelValue = scores[Title][question][level];
            levelKeysAndValues.push({ level, value: levelValue });
        }

        // Sort the array based on the 'value' property in descending order
        levelKeysAndValues.sort((a, b) => b.value - a.value);

        // Fetch the content of level-card.html once
        fetch("https://nkaramichael.github.io/Design-Project/New%20UI/components/level-card.html")
        .then((response) => response.text())
        .then((html) => {
            // loop through the levels
            for (const { level, score } of levelKeysAndValues) {
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
                    const score = 100*Number(scores[Title][question][level]);
                    scoreValue.innerText = score;

                    // set colour based on score
                    let colour = 'white';
                    if (score < 25) {
                        colour = colourRed;
                    } else if (score >= 25 && score < 50) {
                        colour = colourOrange;
                    } else if (score >= 50 && score < 75) {
                        colour = colourYellow;
                    } else {
                        colour = colourGreen;
                    }
                    scoreValue.style.color = colour;

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
        imageList.innerHTML = noDataMessage;
        const modelStats = document.getElementById("modelStats");
        const domainStats = document.getElementById("domainStats");
        clearContainer(modelStats);
        clearContainer(domainStats);
    }
}

function displayOverall() {
    const Title = document.getElementById("surveyDropdown").value;
    const imageList = document.getElementById("imageList");

    const averages = averageScores[Title];

    if (averages === undefined) {
        imageList.innerHTML = noDataMessage;
        return;
    }
    // Sort the array based on the 'value' property in descending order
    const dataArray = Object.entries(averages);

    // Sort the array based on the values (in descending order)
    dataArray.sort((a, b) => b[1] - a[1]);

    // Extract the sorted keys into an array
    const levels = dataArray.map((entry) => entry[0]);
    metaOverall(levels);

    imageList.innerHTML = "";
    for (const level of levels) {
        // Fetch the content of level-card.html once
        fetch("https://nkaramichael.github.io/Design-Project/New%20UI/components/level-card.html")
        .then((response) => response.text())
        .then((html) => {
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
                const score = 100*Number(averages[level]);
                scoreValue.innerText = score;

                // set colour based on score
                let colour = 'white';
                if (score < 25) {
                    colour = colourRed;
                } else if (score >= 25 && score < 50) {
                    colour = colourOrange;
                } else if (score >= 50 && score < 75) {
                    colour = colourYellow;
                } else {
                    colour = colourGreen;
                }
                scoreValue.style.color = colour;

                // Set a unique id for the level-card element
                const uniqueId = level;
                template.content.querySelector('.level-card-parent-div').id = uniqueId;

                // Add the modified element to your container
                imageList.appendChild(template.content);
            
        })
        .catch((error) => {
            console.error("Error loading content:", error);
        });
    }

}

// Update the meta table
function updateMetaTable(levelsToDisplay) {
    const modelStatsContainer = document.getElementById("modelStats");
    const domainStatsContainer = document.getElementById("domainStats");

    // clear containers
    clearContainer(modelStatsContainer);
    clearContainer(domainStatsContainer);

    // compute scores
    const { modelScores, domainScores } = calculateMetaScores(levelsToDisplay);
    
    // fill containers with scores
    fillMetaScores(modelStatsContainer, modelScores);
    fillMetaScores(domainStatsContainer, domainScores);
}

function metaOverall(levels){
    const modelStatsContainer = document.getElementById("modelStats");
    const domainStatsContainer = document.getElementById("domainStats");

    // clear containers
    clearContainer(modelStatsContainer);
    clearContainer(domainStatsContainer);

    // compute scores
    const { modelScores, domainScores } = calculateOverallMeta(levels);

    // fill containers with scores
    fillMetaScores(modelStatsContainer, modelScores);
    fillMetaScores(domainStatsContainer, domainScores);
}

// filles a meta container with average meta scores
function fillMetaScores(container, scores) {
    for (const name in scores) {
        const div = document.createElement("div");
        div.classList.add("level-card-div");
        div.style.padding = "1rem";
        const key = document.createElement("span");
        key.classList.add("level-card-text");
        key.style.fontSize = "18px";
        key.style.fontWeight = "400";
        const value = document.createElement("span");
        value.classList.add("level-card-text");
        value.style.fontSize = "18px";
        value.style.fontWeight = "400";
        div.appendChild(key);
        div.appendChild(value);

        key.innerHTML = name + ": ";
        const score = Math.round(100*scores[name]);
        value.innerHTML = score;

        // set colour based on score
        let colour = 'white';
        if (score < 25) {
            colour = colourRed;
        } else if (score >= 25 && score < 50) {
            colour = colourOrange;
        } else if (score >= 50 && score < 75) {
            colour = colourYellow;
        } else {
            colour = colourGreen;
        }
        value.style.color = colour;

        container.appendChild(div);
    }
}

// calculates the metascores for valid levels
function calculateMetaScores(levelsToDisplay) {
    const question = document.getElementById("questionDropdown").value;
    const Title = document.getElementById("surveyDropdown").value;

    let modelScores = {};
    let domainScores = {};
    let modelDenom = {};
    let domainDenom = {};

    for (const level in levelsToDisplay) {
        const model = levelInfo[level]["model"];
        const domain = levelInfo[level]["domain"];
        const score = scores[Title][question][level];

        // Increment model score
        modelScores[model] = (modelScores[model] || 0) + score;

        // Increment model denominator
        modelDenom[model] = (modelDenom[model] || 0) + 1;

        // Increment domain score
        domainScores[domain] = (domainScores[domain] || 0) + score;

        // Increment domain denominator
        domainDenom[domain] = (domainDenom[domain] || 0) + 1;
    }

    for (const model in modelScores) {
        modelScores[model] /= modelDenom[model];
    }
    
    for (const domain in domainScores) {
        domainScores[domain] /= domainDenom[domain];
    }

    return {
        modelScores,
        domainScores
    };
}

function calculateOverallMeta(levels) {
    const Title = document.getElementById("surveyDropdown").value;

    let modelScores = {};
    let domainScores = {};
    let modelDenom = {};
    let domainDenom = {};

    for (const level of levels) {
        const model = levelInfo[level]["model"];
        const domain = levelInfo[level]["domain"];
        const score = averageScores[Title][level];

        // Increment model score
        modelScores[model] = (modelScores[model] || 0) + score;

        // Increment model denominator
        modelDenom[model] = (modelDenom[model] || 0) + 1;

        // Increment domain score
        domainScores[domain] = (domainScores[domain] || 0) + score;

        // Increment domain denominator
        domainDenom[domain] = (domainDenom[domain] || 0) + 1;
    }

    for (const model in modelScores) {
        modelScores[model] /= modelDenom[model];
    }
    
    for (const domain in domainScores) {
        domainScores[domain] /= domainDenom[domain];
    }

    return {
        modelScores,
        domainScores
    };
}

// Loads survey list
async function loadSurveyList() {
    const email = sessionStorage.getItem('email');

    // get parent cointainer
    const parent = document.getElementById("surveyDropdown");
    // disable while load
    parent.disabled = true;

    // Create a query to fetch quizzes with the specified researcher email
    const query = quizRef.where('Researcher', '==', email);

    const selectSurveyOption = document.getElementById('selectSurveyOption');
    selectSurveyOption.setAttribute("data-special", true);

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

    // enable afater loading complete
    parent.disabled = false;

    loadQuestionList(parent);
}

// fetches all level info from quizTable and adds it to map
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
        })
        .catch(error => {
            console.error("Error fetching documents: ", error);
        });
}

// computes the statistics for all levels*quesiton*surveys
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

// computes overall statistics for survey
function computeOverall() {
    // Loop through the surveys
    for (const title in scores) {
        averageScores[title] = {}; // Initialize the map for this survey
        const weightMap = surveys[title]["Weights"];

        for (const question in scores[title]) {
            for (const level in scores[title][question]) {
                const weight = weightMap[question];
                const score = scores[title][question][level];

                // Initialize the average score for the level if it doesn't exist
                if (!averageScores[title][level]) {
                    averageScores[title][level] = { total: 0, count: 0 };
                }
                
                // Update the total and count for the level
                averageScores[title][level].total += weight*score;
                averageScores[title][level].count += weight;
            }
        }

        // Calculate the final averages for this survey
        for (const level in averageScores[title]) {
            averageScores[title][level] = averageScores[title][level].total / averageScores[title][level].count;
        }
    }
}
