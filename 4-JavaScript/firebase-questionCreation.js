// This script allows researchers to upload images to the database. It also displays the images in a container for the
// researcher to preview.
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
const db = firebase.firestore();
const metaRef = db.collection("Metadata");
  
// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

const errorColor = '#ffb1b8';

const fadeLabel = document.getElementById('notificationLabel');

var types;

// Function to initiate the fade-out effect
function fadeOutLabel() {
  fadeLabel.style.opacity = 0;
}

function addQuestion(){
    let valid = true;

    const selectedType = document.getElementById("dropdown");

    if (selectedType.value == "none"){
        selectedType.style.backgroundColor = errorColor;
        valid = false;
    } else {
        selectedType.style.backgroundColor = "white";
    }

    const weightInput = document.getElementById("weightInput");

    if (weightInput.value == "" || Number(weightInput.value) < 0 || Number(weightInput.value) > 1){
        weightInput.style.backgroundColor = errorColor;
        valid = false;
    } else {
        weightInput.style.backgroundColor = "white";
    }

    const questionText = document.getElementById("questionText");

    if (questionText.value == ""){
        questionText.style.backgroundColor = errorColor;
        valid = false;
    } else {
        if (questionText.value.contains(".") && questionText.value.indexOf(".") != questionText.value.length - 1){
            questionText.style.backgroundColor = errorColor;
            valid = false;
            alert("Please ensure that if your question contains a full-stop, it is placed at the end of the question. (Note: This is a requirement of firebase mapping structures)");
        } else {
            questionText.style.backgroundColor = "white";
        }
    }

    if (!valid){
        return;
    }

    fadeLabel.style.opacity = 1;
    setTimeout(fadeOutLabel, 2000); // Start the fade-out effect after 3 seconds

    // reference to question metadata
    ref = metaRef.doc("QuizData");

    var multiImage;

    if (dropdown.value == "scale"){
        multiImage = false;
    } else {
        multiImage = true;
    }

    // New question data
    const questionMeta = {
        "QuestionType": dropdown.value,
        "MultiImage": multiImage,
        "Weight": Number(weightInput.value)
    };

    // Update the "Questions" map in the Firestore document
    // ref.update({
    // [`Questions.${questionText.value}`]: questionMeta,
    // })
    // .then(() => {
    //     console.log("New question added successfully!");
    // })
    // .catch((error) => {
    //     console.error("Error adding new question: ", error);
    // });

}

// Load the list of Questions from the database into the field
function loadQuestionTypes() {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    // get parent cointainer
    const parent = document.getElementById("dropdown");

    // Fetch the questions array
    ref.get().then((doc) => {
        if (doc.exists) {
            const typeList = doc.data()["QuestionTypes"];
            types = typeList;

            for (let i = 0; i < typeList.length; i++){
                const option = document.createElement("option");
                option.setAttribute("value", typeList[i]);
                option.style.fontFamily = "Inter";
                option.innerHTML = typeList[i];
                option.style.fontStyle = "normal";
                option.style.textAlign = "center";

                parent.appendChild(option);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}