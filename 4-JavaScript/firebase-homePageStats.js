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

// On load function to grab the number of users registered
function displayUsers() {
    // Get a snapshot of the collection
    UserFirestore.get().then((querySnapshot) => {
        // Count the number of documents in the collection
        var userCount = querySnapshot.size;

        // Update the HTML element with the user count
        var userCountElement = document.getElementById('userCount'); // Update 'userCount' with your HTML element's id
        userCountElement.textContent = userCount.toString();
    }).catch((error) => {
        console.error("Error fetching users data:", error);
    });

}

// On load function to grab the number of researchers registered
function displayResearchers() {
    // Get a snapshot of the collection
    ResearcherFirestore.get().then((querySnapshot) => {
        // Count the number of documents in the collection
        var researcherCount = querySnapshot.size;

        // Update the HTML element with the researcher count
        var researcherCountElement = document.getElementById('researcherCount'); // Update 'researcherCount' with your HTML element's id
        researcherCountElement.textContent = researcherCount.toString();
    }).catch((error) => {
        console.error("Error fetching researchers data:", error);
    });
};

// On load function to grab the number of PCGLevels uploaded
function displayPCGLevels() {
    // Get a snapshot of the collection
    LevelFirestore.get().then((querySnapshot) => {
        // Count the number of documents in the collection
        var levelCount = querySnapshot.size;

        // Update the HTML element with the researcher count
        var levelCountElement = document.getElementById('levelCount'); // Update 'levelCount' with your HTML element's id
        levelCountElement.textContent = levelCount.toString();
    }).catch((error) => {
        console.error("Error fetching PCQ data:", error);
    });
};

// On load function to grab the number of surveys created
function displaySurveysCreated() {
    // Get a snapshot of the collection
    QuizFirestore.get().then((querySnapshot) => {
        // Count the number of documents in the collection
        var quizCount = querySnapshot.size;

        // Update the HTML element with the researcher count
        var quizCountElement = document.getElementById('quizCount'); // Update 'levelCount' with your HTML element's id
        quizCountElement.textContent = quizCount.toString();
    }).catch((error) => {
        console.error("Error fetching Quiz data:", error);
    });
};