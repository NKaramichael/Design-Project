
const firebase = require('firebase/app');

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
// firebase.initializeApp(firebaseConfig); Do Not need to reinitialise for testing
var db = firebase.firestore();
var collectionRef = db.collection("Questions");

// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

const change = (num) => {
    let out = '';
    switch (num) {
        case 0:
            out = 'A';
            break;
        case 1:
            out = 'B';
            break;
        case 2:
            out = 'C';
            break;
        default:
            out = ''; // Assign a default value when num doesn't match any case
    }
    return out;
}

function submitQuiz() {
    // document.getElementById('submitQuizForm').addEventListener('submit', submit);
    submit();
}

// Function to submit the quiz to the quiz database, the questions to the question database and the images to the level database
async function submit() {
    // e.preventDefault();

    // // Checking that user has uploaded at least one image
    // const files = document.getElementById('fileInput').files;

    // if (files.length == 0) {
    //     alert("Please upload at least 1 image");
    //     return;
    // }

    // // Checking that heading and description are filled in
    // const heading = document.getElementById('heading').value;
    // const desc = document.getElementById('description').value;
    // var process = true;
    // var errorOutput = "Address the following issues: \n";

    // if (heading == "") {
    //     errorOutput += "Please enter a Quiz heading\n";
    //     process = false;
    // }
    // if (desc == "") {
    //     errorOutput += "Please enter a Quiz description\n";
    //     process = false;
    // }

    // if (process == false) {
    //     alert(errorOutput);
    //     return;
    // }

    // process = true;
    // errorOutput = "Address the following issues: \n";
    // var imageArr = [];

    // // Submit Images(Levels) & metadata to levels table in database
    // for (let i = 0; i < files.length; i++) {
    //     const details = new Map();

    //     // Fetching the selected value from model dropdown
    //     var selectModel = 'model';
    //     selectModel += i;
    //     const selectM = document.getElementById(selectModel);
    //     const valueM = selectM.value;

    //     if (valueM === 'none') {
    //         errorOutput += "Please select a valid model type for image " + change(i) + "\n";
    //         process = false;
    //     } else {
    //         details.set("model", valueM);
    //     }

    //     // Fetching the selected value from domain dropdown
    //     var selectDomain = 'domain';
    //     selectDomain += i;
    //     const selectD = document.getElementById(selectDomain);
    //     const valueD = selectD.value;

    //     if (valueD === 'none') {
    //         errorOutput += "Please select a valid domain type for image " + change(i) + "\n";
    //         process = false;
    //     } else {
    //         details.set("domain", valueD);
    //     }

    //     imageArr.push(details);
    // }

    // if (process == false) {
    //     alert(errorOutput);
    //     return;
    // }

    // // Submit Questions & details to questions table in database
    // var questionList = document.getElementById('questionList');
    // var questions = questionList.getElementsByTagName('li');

    // if (questions.length == 0) {
    //     alert("Cannot create quiz with no questions!");
    //     return;
    // }

    // var mainDiv = document.getElementById('mainDiv');
    // mainDiv.style.display = 'none';
    // document.getElementById('mainHeading').style.display = 'none';
    // loadingScreen.style.display = 'flex';

    // await uploadImages(files, imageArr);

    // var refArr = [];
    // // Iterate through the items
    // for (var i = 0; i < questions.length; i++) {
    //     var question = questions[i];

    //     // Do something with each item (e.g., retrieve text content)
    //     var description = question.textContent.split("|")[0].trim();
    //     var type = question.textContent.split("|")[1].trim();

    //     var data = {
    //         Description: description,
    //         Type: type,
    //     };


    //     collectionRef.add(data)
    //         .then(function (docRef) {
    //             refArr.push(docRef.id + "");
    //             console.log("Document written with ID: ", docRef.id);
    //         })
    //         .catch(function (error) {
    //             console.error("Error adding document: ", error);
    //         });

    // }

    // var imgRefArr = [];
    // for (let i = 0; i < files.length; i++) {
    //     const ref = 'ref' + i;
    //     const refer = sessionStorage.getItem(ref);
    //     imgRefArr.push(refer);
    // }

    // for (let i = 0; i < files.length; i++) {
    //     const ref = 'ref' + i;
    //     sessionStorage.removeItem(ref);
    // }

    // // Submit Quiz as a whole with reference to images and questions to Quiz table in database
    // collectionRef = db.collection("Quizzes");

    // var data = {
    //     Title: heading,
    //     Description: desc,
    //     Status: true,
    //     Questions: refArr,
    //     Images: imgRefArr
    // };

    // collectionRef.add(data)
    //     .then(function (docRef) {
    //         var quiz = data;

    //         collectionRef.doc(docRef.id).set(quiz)
    //             .then(function () {
    //                 alert("Quiz added with ref: " + docRef.id);
    //                 console.log("Successfully added quiz: ", docRef.id);
    //             })
    //             .catch(function (error) {
    //                 console.error("Error adding Quiz: ", error);
    //             });
    //     })
    //     .catch(function (error) {
    //         console.error("Error adding Quiz: ", error);
    //     });

    // // alert("Quiz submitted!");
    // window.location.href = "../2-ResearcherPages/currentResearcherBoard.html";
}

async function uploadImages(files, imageArr) {
    // // Upload images to Firebase Storage and Firestore
    // for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const imgDetails = imageArr[i];
    //     const dom = imgDetails.get('domain');
    //     const mod = imgDetails.get('model');

    //     await uploadImage(file, dom, mod, i);
    // }
}

async function uploadImage(file, domain, model, imageNum) {
    // try {
    //     var storageRef = storage.ref().child('Level/images/' + file.name);

    //     // Create the metadata object with custom metadata fields
    //     var metadata = {
    //         customMetadata: {
    //             domain: domain,
    //             model: model
    //         }
    //     };

    //     // Upload the image file to Firebase Storage with metadata
    //     await storageRef.put(file, metadata);
    //     console.log('Image uploaded successfully!');

    //     // Get the download URL of the uploaded image
    //     var url = await storageRef.getDownloadURL();
    //     console.log('Image URL:', url);

    //     // Save the image URL and metadata in Cloud Firestore
    //     var docRef = await firestore.collection('Levels').add({
    //         imageUrl: url,
    //         domain: domain,
    //         model: model
    //     });
    //     const ref = 'ref' + imageNum;
    //     sessionStorage.setItem(ref, docRef.id);
    //     console.log('Image URL and metadata saved in Firestore! Ref:', docRef.id);
    // } catch (error) {
    //     console.log('Error uploading image:', error);
    // }
}

module.exports = { submitQuiz, change, submit, uploadImages, uploadImage };