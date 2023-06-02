
// import firebase from 'firebase/app';
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

function change(num) {
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
    submit();
}

// Function to submit the quiz to the quiz database, the questions to the question database and the images to the level database
async function submit(files, heading, desc) {
    var output = "";

    // Checking that user has uploaded at least one image
    if (files.length == 0) {
        output = ("Please upload at least 1 image");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(output);
            }, 1000);
        });
    }

    // Checking that heading and description are filled in
    var process = true;
    var errorOutput = "Address the following issues: \n";

    if (heading == "") {
        errorOutput += "Please enter a Quiz heading\n";
        process = false;
    }
    if (desc == "") {
        errorOutput += "Please enter a Quiz description\n";
        process = false;
    }

    if (process == false) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(errorOutput);
            }, 1000);
        });
    }

    process = true;
    errorOutput = "Address the following issues: \n";
    var imageArr = [];

    // Submit Images(Levels) & metadata to levels table in database
    for (let i = 0; i < files.length; i++) {
        const details = new Map();

        // Fetching the selected value from model dropdown
        var selectModel = 'model';
        selectModel += i;
        const valueM = files[i].model0
        
        if (valueM == 'none') {
            errorOutput += "Please select a valid model type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("model", valueM);
        }

        // Fetching the selected value from domain dropdown
        var selectDomain = 'domain';
        selectDomain += i;
        const valueD = files[i].domain0

        if (valueD == 'none') {
            errorOutput += "Please select a valid domain type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("domain", valueD);
        }

        imageArr.push(details);
    }

    if (process == false) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(errorOutput);
            }, 1000);
        });
    }
}

async function uploadImages(files, imageArr) {
    // Upload images to Firebase Storage and Firestore
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgDetails = imageArr[i];
        const dom = imgDetails.get('domain');
        const mod = imgDetails.get('model');

        await uploadImage(file, dom, mod, i);
    }
}

async function uploadImage(file, domain, model, imageNum) {
    
}

module.exports = { submitQuiz, change, submit};