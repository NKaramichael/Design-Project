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

    var email = sessionStorage.getItem('email');
    const Ref = UserFirestore.doc(email);

    if (status == "current"){
        Ref.get()
        .then((doc) => {
            if (doc.exists) {
                const quizRefs = doc.data()[status + 'Quizzes'];
                // loop through array and get info for each quiz to display
                quizRefs.forEach((name) => {
                    const ref = QuizFirestore.doc(name);
                    ref.get()
                        .then((doc) => {
                            if (doc.exists) {
                                // display the quiz block
                                createQuizBlock(doc.data(), status, doc.id);
                            } else {
                                // The document doesn't exist
                                console.log("No such document!");
                            }
                        })
                        .catch((error) => {
                            // An error occurred while retrieving the document
                            console.log("Error getting document:", error);
                        });
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    // Need to implement status = closed
    else if (status == "closed"){

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
      const openButton = document.createElement("button");
      openButton.setAttribute("class", "card-button");
      openButton.textContent = "Open";
      openButton.setAttribute('data-value', JSON.stringify([id, status]));
      div2.appendChild(openButton);
  
      if (status == 'completed') {
        openButton.addEventListener("click", openSurveyPage);
      }
      if (status == 'current') {
        openButton.addEventListener("click", openSurveyPage);
  
        const removeButton = document.createElement("button");
        removeButton.setAttribute("class", "user-dashboard-button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute('data-value', id);
        removeButton.addEventListener("click", removeFromCurrent);
        // Add the elements to the text box
        div2.appendChild(removeButton);
      }
    }
  
    parent.appendChild(card);
  };