
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
var collectionRef = db.collection("Questions");
var urlParams = new URLSearchParams(window.location.search);
var imageList = previewImages(urlParams);

function previewImages(urlParams) {
    const imagePreviewArea = document.getElementById('imagePreviewArea');

    // Clear previous display
    imagePreviewArea.innerHTML = '';

    // Hide the various dropdowns so they are reset when the user re-uploads images
    for (let i = 0; i < 3; i++) {
        // Hide the labels
        var selectLabel = 'label';
        selectLabel += i;
        const selectL = document.getElementById(selectLabel);
        selectL.style.display = 'none';

        // Hide the model dropdown
        var selectName = 'model';
        selectName += i;
        const select = document.getElementById(selectName);
        select.style.display = 'none';

        // Hide the domain dropdown
        var selectDomain = 'domain';
        selectDomain += i;
        const selectD = document.getElementById(selectDomain);
        selectD.style.display = 'none';
    }

    var imageList = [];
    // Loop through all query parameters and retrieve their values
    urlParams.forEach(function(value, key) {
        imageList.push(value);
    });

    for (let i = 0; i < imageList.length; i++){
        // Display image preview
        const img = document.createElement('img');
        img.src = imageList[i];
        img.classList.add('preview-image');
        imagePreviewArea.appendChild(img);

        // Make the correct Image Label Appear
        var selectLabel = 'label';
        selectLabel += i;
        console.log(selectLabel);
        const selectL = document.getElementById(selectLabel);
        selectL.style.display = "inline-block";

        // Display the model type dropdown
        var selectName = 'model';
        selectName += i;
        const select = document.getElementById(selectName);
        select.style.display = "";

        // Display the model domain dropdown
        var selectDomain = 'domain';
        selectDomain += i;
        const selectD = document.getElementById(selectDomain);
        selectD.style.display = "";
    }

    return imageList;
}

function submitQuiz(){
    document.getElementById('submitQuizForm').addEventListener('submit', submit);
}

function change(num){

    let out = '';
    switch (num){
        case 0: out = 'A';
        break;
        case 1: out = 'B';
        break;
        case 2: out = 'C';
        break;
    }

    return out;
}

// Function to submit the quiz to the quiz database, the questions to the question database and the images to the level database
function submit(e){
    e.preventDefault();

    // Checking that heading and description are filled in
    const heading = document.getElementById('heading').value;
    const desc = document.getElementById('description').value;
    var process = true;
    var errorOutput = "Address the following issues: \n";

    if (heading == ""){
        errorOutput += "Please enter a Quiz heading\n";
        process = false;
    }
    if (desc == ""){
        errorOutput += "Please enter a Quiz description\n";
        process = false;
    }

    if (process == false){
        alert(errorOutput);
        return;
    }
    
    process = true;
    errorOutput = "Address the following issues: \n";
    var imageArr = [];
    imageList = imageList;

    // Submit Images(Levels) & metadata to levels table in database
    for (let i = 0; i < imageList.length; i++) {
        const details = new Map();

        // Fetching the selected value from model dropdown
        var selectModel = 'model';
        selectModel += i;
        const selectM = document.getElementById(selectModel);
        const valueM = selectM.value;

        if (valueM === 'none') {
            errorOutput += "Please select a valid model type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("model", valueM);
        }

        // Fetching the selected value from domain dropdown
        var selectDomain = 'domain';
        selectDomain += i;
        const selectD = document.getElementById(selectDomain);
        const valueD = selectD.value;

        if (valueD === 'none') {
            errorOutput += "Please select a valid domain type for image " + change(i) + "\n";
            process = false;
        } else {
            details.set("domain", valueD);
        }

        imageArr.push(details);
    }
    
    if (process == false){
        alert(errorOutput);
        return;
    }

    for (let i = 0; i < imageList.length; i++){
        const dom = imageArr[i].get("domain");
        const mod = imageArr[i].get("model");
        uploadImage(imageList[i], dom, mod);
    }

    // Submit Questions & details to questions table in database
    var questionList = document.getElementById('questionList');
    var questions = questionList.getElementsByTagName('li');

    if (questions.length == 0){
        alert("Cannot create quiz with no questions!");
        return;
    }

    var refArr = [];

    // Iterate through the items
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        // Do something with each item (e.g., retrieve text content)
        var description = question.textContent.split("|")[0].trim();
        var type = question.textContent.split("|")[1].trim();

        var data = {
            Description: description,
            Type: type,
          };
        
        collectionRef.add(data)
        .then(function(docRef) {
          refArr.push(docRef.id + "");
        console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
        console.error("Error adding document: ", error);
        });
    }

    // Submit Quiz as a whole with reference to images and questions to Quiz table in database
    collectionRef = db.collection("Quizzes");

    var data = {
      Title: heading,
      Description: desc,
      Status: true,
      Questions: refArr,
      Images: imageList
    };

    collectionRef.add(data)
      .then(function(docRef) {
        var quiz = data;

        collectionRef.doc(docRef.id).set(quiz)
        .then(function() {
          console.log("Successfully added quiz: ", docRef.id);
        })
        .catch(function(error) {
        console.error("Error adding Quiz: ", error);
        });
      })
      .catch(function(error) {
      console.error("Error adding Quiz: ", error);
      });

    
}

function uploadImage(url, domain, model) {
    var refArr = [];

    // Create a storage reference for the image file
    var db = firebase.firestore();
    var collectionRef = db.collection("Levels");
    
    // Save the image URL in Cloud Firestore
    collectionRef.add({
        imageUrl: url,
        domain: domain,
        model: model
    }).then(function (docRef) {

        console.log('Image URL saved in Firestore!');
    });
    
}

function fetchImageRefs(imageList){
    // Step 1: Retrieve image URLs from Firestore collection
    var collectionRef = db.collection('Levels');
    
    collectionRef.where("imageUrl", "in", imageList).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        refArr.push(doc.id);
    });
    }).catch(function(error) {
    console.log("Error retrieving Firestore documents:", error);
    });

    return refArr;
}
