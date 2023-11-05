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

// Load the list of Questions from the database into the field
function loadQuestionList() {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    // get parent cointainer
    const parent = document.getElementById("dropdown");;

    // Fetch the questions array
    ref.get().then((doc) => {
        if (doc.exists) {
            const questionList = doc.data()["Questions"];
            
            // Loop through each question in the question list
            for (let i = 0; i < questionList.length; i++){
                const question = questionList[i];

                const option = document.createElement("option");
                option.setAttribute("value", i);
                option.style.fontFamily = "Inter";
                option.innerHTML = question["QuestionText"];
                option.style.fontStyle = "normal";

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