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

var currentQuestion;

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
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = description;
};

function previousQuestion() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");
    
    currentQuestion--;
    if (currentQuestion == 0) {
        prevButton.style.display = "none";
    }
    nextButton.style.display = "block";

    changeQuestion();
}

function nextQuestion() {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    if (nextButton.innerHTML === "Start Survey") {
        fillNavbar();
        nextButton.innerHTML = "Next Question"
        currentQuestion = 0;
    } else {
        currentQuestion++;
    }
    if (currentQuestion == questionList.length - 1) {
        nextButton.style.display = "none";
    }
    if (currentQuestion > 0) {
        prevButton.style.display = "block";
    }
    changeQuestion(); 
}

async function openSurvey() {
// Get the quizId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const quizID = urlParams.get('quizId');

const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

prevButton.style.display = "none"; // hide previous button in survey "main page"

prevButton.onclick = previousQuestion;
nextButton.onclick = nextQuestion;

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
                        ["multiImage", question["multiImage"]]
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
    
    for (const question of questionList) {
        if (levels.length !== 0) {
          numImages = 1;
          const min = 2;
          const max = 6;
    
          if (question.get("multiImage") === true) {
            numImages = Math.floor(Math.random() * (max - min + 1)) + min;
          }
    
          questionLevels = [];
          questionLevelUrls = [];
    
          for (let i = 0; i < numImages; i++) {
            const imageIndex = pickRandomImage(levels, pickedImages);
            questionLevels.push(levels[imageIndex]);
    
            const ref = levelRef.doc(levels[imageIndex]);
    
            try {
                await ref.get().then((doc) => {
                    if (doc.exists) {
                        questionLevelUrls.push(doc.data()["imageUrl"]);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                }
                });
            } catch (error) {
              console.log("Error getting document:", error);
            }
          }
    
          question.set("levels", questionLevels);
          question.set("levelUrls", questionLevelUrls);
        }
      }
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

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
}

function updateImageContainer(imageContainer) {
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
        
        if (questionList[currentQuestion].get("multiImage") === true) { 
            const label = document.createElement("span");
            label.textContent = String.fromCharCode(65 + index); // 'A', 'B', 'C', ...

            // Add styling to the label
            label.style.fontSize = "22px";
            label.style.fontWeight = "bold";
            label.style.color = "white";
            label.style.marginTop = "15px"; // Add spacing between image and label

            imageAndLabelContainer.appendChild(label);
        }

        // Append the container to the imageContainer
        imageContainer.appendChild(imageAndLabelContainer); // display image and label on-screen
    });
}

function updateAnswerContainer(answerFieldContainer) {
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

            label.insertBefore(input, label.firstChild);

            answerFieldContainer.appendChild(label);
        }
    }
}

function changeQuestion() {
    const questionContainer = document.getElementById("surveyHeading");
    const imageContainer = document.getElementById("imageContainer");
    const answerFieldContainer = document.getElementById("answerFieldContainer");

    clearContainer(imageContainer);
    clearContainer(answerFieldContainer);
    // set Question Text
    questionContainer.innerHTML = questionList[currentQuestion].get("questionText");
    // Update Image Container
    updateImageContainer(imageContainer);
    // Update Answer Container
    updateAnswerContainer(answerFieldContainer);
}

function changeQuestionFromNavBar(button) {
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    currentQuestion = button.id;
    prevButton.style.display = "block";
    nextButton.style.display = "block";
    if (currentQuestion == 0) {
        prevButton.style.display = "none";
    }
    if (currentQuestion == questionList.length){
        nextButton.style.display = "block";
    }

    changeQuestion();
}

function fillNavbar() {
    navBar = document.getElementById("navBar");

    questionList.forEach((question, index) =>
        {
        const button = document.createElement("button");
    
        button.setAttribute("class", "navBar-button");
        button.setAttribute("id", index);
        button.setAttribute("onclick", "changeQuestionFromNavBar(this)");
        button.innerHTML = index;
    
        navBar.appendChild(button);
        }
    )
}

function setScaleNumber(element) {
    const label = element.labels[0];
    label.textContent = element.value;
}

// This function ensures that only 1 radio button can br pressed at a time, ignores if its a checkbox
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