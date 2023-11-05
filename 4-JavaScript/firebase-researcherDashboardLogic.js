// It is the bucket. It does the bucket
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
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

//firestore references
const db = firebase.firestore();
var UserFirestore = db.collection('Users');
var ResearcherFirestore = db.collection('Researchers');
var LevelFirestore = db.collection('Levels');
var QuizFirestore = db.collection('Quizzes');
var QuestionFirestore = db.collection('Questions');


//   ---- display their currently active quizzes to researcher ----
function displayCurrentQuizzes() {
    // Need to clear container for when pages are switched between
    container = document.getElementById("container");
    // Remove all child elements from the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    displayQuizzes("current");
};

//   ---- not used yet, need to implement displaying quizzes researcher has decided to close -------- //
function displayClosedQuizzes() {
    // Need to clear container for when pages are switched between
    container = document.getElementById("container");
    // Remove all child elements from the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    displayQuizzes("closed");
};

// Fetching and display the user's quizzes
function displayQuizzes(status) {

    var researcherEmail = sessionStorage.getItem('email');

    if (status == "current") {
        // 1. Retrieve the researcher's document to get their mySurveys field
        ResearcherFirestore.doc(researcherEmail).get()
            .then((researcherSnapshot) => {
                if (researcherSnapshot.exists) {
                    const researcherData = researcherSnapshot.data();
                    const mySurveys = researcherData.mySurveys || [];

                    // 2. Fetch quiz information for each quiz in mySurveys
                    const quizPromises = mySurveys.map((quizName) => {
                        return QuizFirestore.doc(quizName).get();
                    });

                    // 3. Process the fetched quiz data
                    Promise.all(quizPromises)
                        .then((quizSnapshots) => {
                            const quizzes = quizSnapshots
                                .filter((quizSnapshot) => quizSnapshot.exists)
                                .map((quizSnapshot) => quizSnapshot.data());

                            // Now, 'quizzes' contains the quiz information for the researcher
                            console.log(quizzes);

                            // Iterate through the quizzes and call createQuizBlock for each one
                            quizzes.forEach((quiz, index) => {
                                createQuizBlock(quiz, "current", index);
                            });

                            if (quizzes.length == 0) {
                                // Create an empty div to add space above the text
                                const spaceDiv = document.createElement("div");
                                spaceDiv.style.height = "50vh";


                                const email = sessionStorage.getItem("email");
                                const parent = document.getElementById("container");
                                const title = document.createElement("h1");
                                title.setAttribute("style", "color: white;");
                                title.textContent = `Oops! No surveys made yet`;
                                parent.appendChild(spaceDiv);
                                parent.appendChild(title);

                                const helpText = document.createElement("h3");
                                helpText.setAttribute("style", "color: white; font-weight: normal;");
                                helpText.textContent = `Be sure to create a survey using the panel on your dashboard`;
                                parent.appendChild(helpText);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching quiz data:", error);
                        });
                } else {
                    console.error("Researcher document not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching researcher data:", error);
            });
    }

    // Need to implement status = closed
    else if (status == "closed") {

    }


};

// Function to create each survey item popup
async function createQuizBlock(data, status, id) {
    // Get the parent element to which the text boxes will be added
    const parent = document.getElementById("container");

    const card = document.createElement("div");

    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "../New UI/components/survey-card.css");
    parent.appendChild(link);

    const div1 = document.createElement("div")
    div1.setAttribute("class", "survey-card-container");
    card.appendChild(div1);

    const div2 = document.createElement("div");
    div2.setAttribute("class", "survey-card-gallery-card testimonal");

    div1.appendChild(div2);

    // add desc, image, title to card element
    const title = document.createElement("h2");
    title.setAttribute("class", "survey-card-text");
    div2.appendChild(title);

    const image = document.createElement("img");
    image.setAttribute("class", "survey-card-image");
    div2.appendChild(image);

    const description = document.createElement("span");
    description.setAttribute("class", "survey-card-text1");
    div2.appendChild(description);

    levelName = data["Levels"][0];
    const url = await getLevelUrl(levelName);
    image.setAttribute("src", url)

    title.textContent = data['Title']
    description.textContent = data['Description']

    if (status == 'new') {
        const addButton = document.createElement("button");
        addButton.setAttribute("class", "card-button");
        addButton.textContent = "Add to Current";
        addButton.setAttribute('data-value', id);
        addButton.addEventListener("click", addToCurrent);
        div2.appendChild(addButton);
    } else {
        const closeButton = document.createElement("button");
        closeButton.setAttribute("class", "card-button");
        closeButton.textContent = "Close";
        closeButton.setAttribute('data-value', JSON.stringify([id, status]));
        div2.appendChild(closeButton);

    }

    parent.appendChild(card);
};

async function getLevelUrl(levelName) {
    const levelRef = LevelFirestore.doc(levelName);
    let url = '';

    try {
        const doc = await levelRef.get();
        if (doc.exists) {
            url = doc.data()['imageUrl'];
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log("Error getting document");
    }

    return url;
};