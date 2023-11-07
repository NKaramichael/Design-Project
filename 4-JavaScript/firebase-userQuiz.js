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

const db = firebase.firestore();
const quizRef = db.collection("Quizzes");
const metaRef = db.collection("Metadata");
const levelRef = db.collection("Levels");
const userRef = db.collection('Users');
const researcherRef = db.collection('Researchers');
const questionRef = db.collection('Questions');

var currentQuestion;
const errorRedHex = "#fdd6d3";

// QUIZ DATA
const urlParams = new URLSearchParams(window.location.search);
const quizID = urlParams.get('quizId');
var questionList = [];
const responsesRef = quizRef.doc(quizID).collection("Responses");
const imageDiv = document.getElementById("imageContainer");

// Restyles the image container if there are too many images in the container
function checkOverflow() {
    if (imageDiv.scrollWidth > imageDiv.clientWidth) {
        imageDiv.style.justifyContent = 'flex-start'; // Content overflows, align left
    } else {
        imageDiv.style.justifyContent = 'center'; // Content fits, center it
    }
}

// Add an event listener to check for overflow on window resize
window.addEventListener('resize', checkOverflow);

// Sets the Heading/Title
async function displayHeading(heading) {
    // Get a reference to the parent container element
    const headerContainer = document.getElementById("surveyHeading");
    headerContainer.innerHTML = heading;
};

// Sets the description [uses image container]
async function displayDescription(description) {
    // Get a reference to the parent container element
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = description;
};

//  onClick of prev button
function previousQuestion() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    const submitButton = document.getElementById("submitBtn");
    const answerFieldContainer = document.getElementById("answerFieldContainer");
    
    submitButton.style.display = "none";

    // save answer to current question before updating containers
    saveAnswer(answerFieldContainer);
    
    currentQuestion--;
    if (currentQuestion == 0) {
        prevButton.style.display = "none";
    }
    nextButton.style.display = "block";

    changeQuestion();
}

// onClick of next button
function nextQuestion() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    const submitButton = document.getElementById("submitBtn");
    const answerFieldContainer = document.getElementById("answerFieldContainer");

    if (nextButton.innerHTML === "Start Survey") {
        fillNavbar();
        nextButton.innerHTML = "Next Question"
        currentQuestion = 0;
    } else {
        // save answer to current question before updating containers
        saveAnswer(answerFieldContainer);
        currentQuestion++;
    }
    if (currentQuestion == questionList.length - 1) {
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    } else {
        submitButton.style.display = "none";
    }
    if (currentQuestion > 0) {
        prevButton.style.display = "block";
    }

    changeQuestion(); 
}

// Onload function - sets heading and description and calls loadQuestionList() 
async function openSurvey() {
    // Get the quizId from the URL query parameters
    

    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    const submitButton = document.getElementById("submitBtn");

    prevButton.style.display = "none"; // hide previous button in survey "main page"
    nextButton.style.display = "none";
    submitButton.style.display = "none";

    prevButton.onclick = previousQuestion;
    nextButton.onclick = nextQuestion;
    submitButton.onclick = submit;

    quizDoc = quizRef.doc(quizID)
    await quizDoc.get()
        .then(async (doc) => {
        if (doc.exists) {
            displayHeading(doc.data()["Title"]);
            displayDescription(doc.data()["Description"]);
            await loadQuestionList(doc.data()["Questions"], doc.data()["Levels"]);
        } else {
            // The document doesn't exist
            console.log("No such document!");
        }
        })
        .catch((error) => {
        // An error occurred while retrieving the document
        console.log("Error getting document:", error);
        });

        nextButton.style.display = "block";
        console.log(questionList);
}

// Submit onclick()
async function submit() {
    const email = sessionStorage.getItem("email");
    const answerFieldContainer = document.getElementById("answerFieldContainer");

    // check responses ar valid
    saveAnswer(answerFieldContainer);
    const valid = validateResponses();
    
    if (valid) {
        // Disables buttons and spins if the survey is to be submitted
        const submitButton = document.getElementById("submitBtn");
        submitButton.disabled = true;
        submitButton.innerHTML = '<img style="height: auto; max-height: 40px;" class="loading-icon" src="../Resources/loading.png" alt="Loading Spinner" id="spinner">';
        Array.from(document.getElementById("navBar").children).forEach((child) => { child.disabled = true;});
        document.getElementById("prevBtn").disabled = true;

        // set quiz to completed
        await userRef.doc(email).update({
            currentQuizzes: firebase.firestore.FieldValue.arrayRemove(quizID),
            completedQuizzes: firebase.firestore.FieldValue.arrayUnion(quizID)
        });

        await saveResponse();
        window.location.href = "./user-dashboard.html";
    }
};

// Loads all the question data from database and store in global array 
async function loadQuestionList(questions, levels) {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    await ref.get().then((doc) => {
        if (doc.exists) {
            const allQuestions = doc.data()["Questions"];
            // loop through array and get info for each quiz to display
            for (const [questionText, question] of Object.entries(allQuestions)) {
                if (questions.includes(questionText)) {
                    questionList.push(
                        new Map([
                        ["questionText", questionText],
                        ["questionType", question["QuestionType"]],
                        ["MultiImage", question["MultiImage"]],
                        ["response", []]
                        ])
                    );
                }
            }
            } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    const pickedImages = new Set();
    
    for (const question of questionList) {
        if (levels.length !== 0) {
            numImages = 1;
            const min = 2;
            const max = 6;
        
            if (question.get("MultiImage") === true) {
                numImages = Math.floor(Math.random() * (max - min + 1)) + min;
            }
        
            const questionLevels = [];
            const levelPromises = [];

            for (let i = 0; i < numImages; i++) {
                const imageIndex = pickRandomImage(levels, pickedImages);
                questionLevels.push(levels[imageIndex]);

                const ref = levelRef.doc(levels[imageIndex]);
                const levelPromise = ref.get().then((doc) => {
                    if (doc.exists) {
                        return doc.data()["imageUrl"];
                    } else {
                        console.log("No such document!");
                        return null; // Return a placeholder value if the document doesn't exist
                    }
                });

                levelPromises.push(levelPromise);
            }

            try {
                const questionLevelUrls = await Promise.all(levelPromises);

                // Now you have fetched all the level URLs and stored them in levelResults.
                // Next, reorder the arrays based on the original order of questionLevels.
                const indexMapping = questionLevels.map((_, index) => index);

                const reorderedLevelUrls = reorderArrayBasedOnIndexes(questionLevelUrls, indexMapping);

                question.set("levels", questionLevels);
                question.set("levelUrls", reorderedLevelUrls);
            } catch (error) {
                console.log("Error getting documents:", error);
            }

        }
      }
}

function reorderArrayBasedOnIndexes(array, indexMapping) {
    const reorderedArray = new Array(array.length);

    for (const [index, item] of array.entries()) {
        const targetIndex = indexMapping[index];
        reorderedArray[targetIndex] = item;
    }

    return reorderedArray;
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

// Removes all children from container
function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
}

// updates the imageConatiner on navigate
async function updateImageContainer(imageContainer) {
    questionList[currentQuestion].get("levels").forEach((level, index) => {
        // Create a container for each image and label
        const imageAndLabelContainer = document.createElement("div");
        imageAndLabelContainer.style.textAlign = "center"; // Center align the contents
        imageAndLabelContainer.style.marginRight = "15px";

        // Create the image element
        const image = document.createElement("img");
        image.classList.add("img-fluid");
        image.style.maxWidth = "300px";
        image.style.maxHeight = "300px";
        image.style.boxShadow = "2px 2px #000";
        image.setAttribute("src", questionList[currentQuestion].get("levelUrls")[index]);
        image.setAttribute("data-value", level);

        // Append the image and label to the container
        imageAndLabelContainer.appendChild(image);
        
        if (questionList[currentQuestion].get("MultiImage") === true) { 
            const label = document.createElement("span");
            label.textContent = String.fromCharCode(65 + index); // 'A', 'B', 'C', ...

            // Add styling to the label
            label.style.fontSize = "22px";
            label.style.fontWeight = "bold";
            label.style.color = "white";
            label.style.marginTop = "15px"; // Add spacing between image and label

            imageAndLabelContainer.appendChild(label);
            checkOverflow();
        }

        // Append the container to the imageContainer
        imageContainer.appendChild(imageAndLabelContainer); // display image and label on-screen
        checkOverflow();
    });
    checkOverflow();
}

// Updates the anwerFieldContainer on navigate
function updateAnswerContainer(answerFieldContainer) {
    // get the previously saved answer
    const response = questionList[currentQuestion].get("response");
    const questionType = questionList[currentQuestion].get("questionType");
    if (questionType == "scale") { // Display a scale for a singular image question
        //  If scale we know question is single image
        let scaleContainer = document.createElement("div");
        scaleContainer.style.textAlign = "center";
        scaleContainer.style.width = "25%";

        const scale = document.createElement("input");
        scale.setAttribute("data-value", questionType);
        scale.addEventListener("input", function () { setScaleNumber(this) });
        scale.value = "5";
        // set the saved value if exists
        if (response.length != 0) {scale.value = String(response[0])};
        scale.type = "range";
        scale.min = "0";
        scale.max = "10";
        scale.step = "1";
        scale.id = "scaleInput";
        scale.style.width = "100%";

        const label = document.createElement("label");
        label.setAttribute("id", questionType);
        label.setAttribute("data-value", questionType);
        label.setAttribute("for", scale.id);
        label.textContent = scale.value;
        label.style.color = "white";

        scaleContainer.appendChild(scale);
        scaleContainer.appendChild(label);
        answerFieldContainer.appendChild(scaleContainer);

    }
    else { // Display either a checkbox or a radio button type for multi image question
        const numImages = questionList[currentQuestion].get("levels").length;
        for (let index = 0; index < numImages; index++) {
            //  If not scale we know question is multi image
            const label = document.createElement("label");
            label.setAttribute("id", index);
            label.setAttribute("data-value", questionType);
            label.setAttribute("onchange", "answerToggle(this)");
            label.textContent = String.fromCharCode(65 + index);
            label.style.color = "white";
            label.style.marginRight = "15px"; // Add spacing between buttons

            const input = document.createElement("input");
            input.setAttribute("type", questionType);
            input.style.marginRight = "5px";
            // set the saved value if exists
            if (response.includes(index)) {input.checked = true};

            label.insertBefore(input, label.firstChild);

            answerFieldContainer.appendChild(label);
        }
    }
}

// Calls all funcitons to update containers on navigate
async function changeQuestion() {
    const questionContainer = document.getElementById("surveyHeading");
    const imageContainer = document.getElementById("imageContainer");
    const answerFieldContainer = document.getElementById("answerFieldContainer");
    const navBar = document.getElementById("navBar");

    navBar.children[currentQuestion].style.backgroundColor = "var(--dl-color-primary-300)";

    clearContainer(imageContainer);
    clearContainer(answerFieldContainer);
    // set Question Text
    questionContainer.innerHTML = questionList[currentQuestion].get("questionText");
    // Update Image Container
    await updateImageContainer(imageContainer);
    // Update Answer Container
    updateAnswerContainer(answerFieldContainer);

    // Checks if Image Container overflows and adjusts it to fit the images adequetely
    checkOverflow();
}

// Calls changeQuestion and sets button visibility
function changeQuestionFromNavBar(button) {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    const submitButton = document.getElementById("submitBtn");
    // save answer to current question before updating containers
    saveAnswer(answerFieldContainer);
    
    currentQuestion = button.id;
    prevButton.style.display = "block";
    nextButton.style.display = "block";
    if (currentQuestion == 0) {
        prevButton.style.display = "none";
    }
    if (currentQuestion == questionList.length - 1){
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    } else {
        submitButton.style.display = "none";
    }

    changeQuestion();
}

// fills the navbar with buttons on start survey
function fillNavbar() {
    navBar = document.getElementById("navBar");

    questionList.forEach((question, index) =>
        {
        const button = document.createElement("button");
    
        button.setAttribute("class", "navBar-button");
        button.setAttribute("id", index);
        button.setAttribute("onclick", "changeQuestionFromNavBar(this)");
        button.innerHTML = index;
        if (index == 0) {button.style.borderLeft = "2px solid #ffffff"}
        else {button.style.borderLeft = "none"}
    
        navBar.appendChild(button);
        }
    )
}

// Sets scale label to match selected value
function setScaleNumber(element) {
    const label = element.labels[0];
    label.textContent = element.value;
}

// This function ensures that only 1 radio button can be pressed at a time, ignores if its a checkbox
function answerToggle(element) {
    const parent = element.parentNode;
    if (element.getAttribute("data-value") == "radio") {
        const children = parent.children;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] != element) {
                const radio = children[i].querySelector('input[type="radio"]');
                radio.checked = false;
            }
        }
    }
}

// save the question answer to the question Map
function saveAnswer(answerFieldContainer) {
    navBar = document.getElementById("navBar");
    navBar.children[currentQuestion].style.backgroundColor = "#161940";

    const questionType = questionList[currentQuestion].get("questionType");

    if (answerFieldContainer.hasChildNodes()) {
        if (questionType == "scale") {
            const score = Number(answerFieldContainer.firstChild.firstChild.value);
            questionList[currentQuestion].set("response", [score]);

        } else {
            var response = [];

            const children = answerFieldContainer.children;
            for (let i = 0; i < children.length; ++i) {
                if (children[i].firstChild.checked) { response.push(i) }
            }
            questionList[currentQuestion].set("response", response);
        }
    }
}

// validate responses on submit
function validateResponses() {
    navBar = document.getElementById("navBar");

    var valid = true;
    questionList.forEach((question, index) => {
        const questionType = question.get("questionType");
        const response = question.get("response");
        if (questionType != "checkbox" && response.length === 0) {
            navBar.children[index].style.backgroundColor = errorRedHex;
            valid = false;
        }
    });

    return valid;
}

// Submits the scorers to the database
// async function submitGlobalScores() {
//     // for each question loop through levels and update scores
//     for (const question of questionList) {
//         // get an array of selected levels for non scale questions to check for containment during the query
//         selected = [];
//         if (question.get("questionType") != "scale") {
//             for(const response of question.get("response")){
//                 selected.push(question.get("levels")[response]);
//             }
//         }

//         // for each level in the question
//         for(const level of question.get("levels")) {
//             const ref = levelRef.doc(level);
//             await ref.get()
//             .then((doc) => {
//                 if (doc.exists) {
//                 const data = doc.data();
//                 const questionReference = question.get("questionText");

//                 // APPEARED MAP UPDATE
//                 // step 1: Check if the Map contains a key for this question yet and update or add the key-value pair
//                 const appearedMap = data.appeared || {};
//                 if (appearedMap.hasOwnProperty(questionReference)) {
//                     appearedMap[questionReference] = appearedMap[questionReference] + 1;
//                 } else {
//                     appearedMap[questionReference] = 1;
//                 }

//                 // SCORE MAP UPDATE
//                 const scoreMap = data.score || {};
//                 // get the score depending on questionType
//                 var score = 0;
//                 if (question.get("questionType") == "scale") {
//                     score = question.get("response")[0]/10;
//                 } else {
//                     if (selected.includes(level)) {
//                         score = 1;
//                     }
//                 }
                
//                 // step 1: Check if the Map contains a key for this question yet and update or add the key-value pair
//                 if (scoreMap.hasOwnProperty(questionReference)) {
//                     scoreMap[questionReference] = scoreMap[questionReference] + score;
//                 } else {
//                     scoreMap[questionReference] = score;
//                 }

//                 // Step 4: Update the Firestore document
//                 ref.update({ appeared: appearedMap, score: scoreMap })
//                 .then(() => {
//                     console.log("Arrays updated successfully.");
//                   })
//                   .catch((error) => {
//                     console.error("Error updating arrays:", error);
//                   });
            
//                 } else {
//                 console.log("Document does not exist.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error getting document:", error);
//             });
//         }
//     }
// }

// Store the responses in the database (not associated with user)
async function saveResponse() {
    // Use a batch to group multiple write operations together and execute them as a single atomic transaction
    const batch = db.batch(); 

     // for each question loop through levels and update scores
     for (const question of questionList) {
         const questionText = question.get("questionText");

         // get an array of selected levels for non scale questions to check for containment during the query
         selected = [];
         if (question.get("questionType") != "scale") {
             for(const response of question.get("response")){
                 selected.push(question.get("levels")[response]);
                }
            }
            
        // for each level in the question
        for(const level of question.get("levels")) {
            // Define the values to increment based on score
            var scoreValue = 0;
            if (question.get("questionType") == "scale") {
                scoreValue = question.get("response")[0]/10;
            } else {
                if (selected.includes(level)) {
                    scoreValue = 1;
                }
            }

            // Define the document reference for the current document
            const docRef = responsesRef
                .where("Question", "==", questionText)
                .where("Level", "==", level)
                .limit(1); // Limit to 1, as there should be only one matching document

            
            // Check for a response and update it if it exists, otherwise create one
            const querySnapshot = await docRef.get();
            if (!querySnapshot.empty) {
                // Document exists, update its values
                const doc = querySnapshot.docs[0]; // Should only be one matching document

                // Add the update operation to the batch
                batch.update(doc.ref, {
                    score: firebase.firestore.FieldValue.increment(scoreValue),
                    appeared: firebase.firestore.FieldValue.increment(1)
                });
            } else {
                // Document does not exist, add the create operation to the batch
                batch.set(responsesRef.doc(), {
                    Question: questionText,
                    Level: level,
                    score: scoreValue,
                    appeared: 1
                });
            }
        }
     }

     // Commit the batch
    await batch.commit()
    .then(() => {
        console.log("Batched write successful");
    })
    .catch((error) => {
        console.error("Error performing batched write: ", error);
    });
}
