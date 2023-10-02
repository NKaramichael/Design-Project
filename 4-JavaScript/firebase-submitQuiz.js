
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
var metaRef = db.collection("Metadata");
var levelRef = db.collection("Levels");

var imagePool = [];
var imagePoolLinks = [];
const pickedImages = new Set();

// function submitQuiz() {
//     document.getElementById('submitQuizForm').addEventListener('submit', submit);
// }

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

var loadingScreen = document.getElementById('loading-screen');

// Function to submit the quiz to the quiz database, the questions to the question database and the images to the level database
async function submit() {
    //--------------- Deprecated ----------------------//
    // Checking that user has uploaded at least one image
    // const files = document.getElementById('fileInput').files;

    //--------------- Deprecated ----------------------//
    // Commented out because the user no longer NEEDS to upload an image to create a quiz
    // if (files.length == 0) {
    //     alert("Please upload at least 1 image");
    //     return;
    // }

    // Checking that heading and description are filled in
    const heading = document.getElementById('heading').value;
    const desc = document.getElementById('description').value;
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
        alert(errorOutput);
        return;
    }

    // process = true;
    errorOutput = "Address the following issues: \n";

    //--------------- Deprecated ----------------------//
    //var imageArr = [];
    // Submit Images(Levels) & metadata to levels table in database
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

    // Submit Questions & details to questions table in database
    var questionList = document.getElementById('currentQuestionList');
    var questions = questionList.getElementsByTagName('li');

    //------------------ Depracated --------------------//
    // if (questions.length == 0) {
    //     alert("Cannot create quiz with no questions!");
    //     return;
    // }

    var mainDiv = document.getElementById('mainDiv');
    mainDiv.style.display = 'none';
    document.getElementById('mainHeading').style.display = 'none';
    loadingScreen.style.display = 'flex';

    //------------------ Depracated --------------------//
    // await uploadImages(files, imageArr);

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
            .then(function (docRef) {
                refArr.push(docRef.id + "");
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

    }

    var imgRefArr = [];
    for (let i = 0; i < files.length; i++) {
        const ref = 'ref' + i;
        const refer = sessionStorage.getItem(ref);
        imgRefArr.push(refer);
    }

    for (let i = 0; i < files.length; i++) {
        const ref = 'ref' + i;
        sessionStorage.removeItem(ref);
    }

    // Submit Quiz as a whole with reference to images and questions to Quiz table in database
    collectionRef = db.collection("Quizzes");
    
    var data = {
        Title: heading,
        Description: desc,
        Status: true,
        Questions: refArr,
        Images: imgRefArr,
        Researcher: sessionStorage.getItem('email')
    };

    collectionRef.add(data)
        .then(function (docRef) {
            var quiz = data;

            collectionRef.doc(docRef.id).set(quiz)
                .then(function () {
                    alert("Quiz added with ref: " + docRef.id);
                    window.location.href = "../2-ResearcherPages/currentResearcherBoard.html";
                    console.log("Successfully added quiz: ", docRef.id);
                })
                .catch(function (error) {
                    console.error("Error adding Quiz: ", error);
                });
        })
        .catch(function (error) {
            console.error("Error adding Quiz: ", error);
        });
}

// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

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
    try {
        var storageRef = storage.ref().child('Level/images/' + file.name);

        // Create the metadata object with custom metadata fields
        var metadata = {
            customMetadata: {
                domain: domain,
                model: model
            }
        };

        // Upload the image file to Firebase Storage with metadata
        await storageRef.put(file, metadata);
        console.log('Image uploaded successfully!');

        // Get the download URL of the uploaded image
        var url = await storageRef.getDownloadURL();
        console.log('Image URL:', url);

        // Save the image URL and metadata in Cloud Firestore
        var docRef = await firestore.collection('Levels').add({
            imageUrl: url,
            domain: domain,
            model: model
        });
        const ref = 'ref' + imageNum;
        sessionStorage.setItem(ref, docRef.id);
        console.log('Image URL and metadata saved in Firestore! Ref:', docRef.id);
    } catch (error) {
        console.log('Error uploading image:', error);
    }
}

function setIndeces(navBar) {
    const children = navBar.children;
    for (let i = 0; i < children.length; i++) {
        children[i].textContent = i;
        
        if (i == 0) {
            children[i].style.borderLeft = "2px solid #ffffff";
        } else {
            children[i].style.borderLeft = "none";
        } 
    }
}

function toggleDefualtQuestion(element){
    // Find the checkbox element within the label
    const checkbox = element.querySelector('input[type="checkbox"]');
    const navBar = document.getElementById("navBar");

    if (checkbox) {
        if (checkbox.checked) {
            const button = document.createElement("button");

            button.setAttribute("class", "navBar-button");
            button.setAttribute("id", element.id);
            button.setAttribute("data-value", element.getAttribute("data-value"));
            button.setAttribute("onclick", "selectQuestion(this)");
            
            navBar.appendChild(button);
            setIndeces(navBar);
            selectQuestion(navBar.querySelector(`button[id="${element.id}"]`))
        } else {
            const buttonElement = navBar.querySelector(`button[id="${element.id}"]`);
            if (buttonElement) {
                buttonElement.remove();
                setIndeces(navBar);
                if (element.id - 1 >= 0) {
                    selectQuestion(navBar.querySelector(`button[id="${element.id-1}"]`));
                } else {
                    setPreviewBlank();
                }

            } else {
                console.log("Warning: button was never added to current");
            }
        }
    } else {
        console.log("Checkbox not found");
    }
}

function setPreviewBlank() {
    const questionTextForm = document.getElementById("questionPreview");
    const imageContainer = document.getElementById("imageContainer");
    
    // clear text
    let questionText = "";
    questionTextForm.textContent = questionText;
    
    // TODO: set all question preview elements to default state

    // Loop through and remove all child nodes
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    };
}

// on click method for the navigation buttons at the bottom of the page
function selectQuestion(button) {
    const questionTextForm = document.getElementById("questionPreview");
    const defaultQuestionList = document.getElementById("defaultQuestionList");
    const imageContainer = document.getElementById("imageContainer");

    let question = defaultQuestionList.querySelector(`label[id="${button.id}"]`);
    let questionText = question.textContent;
    isMulti = question.getAttribute("multi-Image");

    // set question text
    questionTextForm.textContent = questionText;

    if (imagePool.length != 0 ){
        // Loop through and remove all child nodes
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }
        let numImages = 1;
        const min = 2;
        const max = 6;
    
        //  set random number of images for multi question
        if (isMulti == "true") {
            numImages = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    
        // get random images from pool and add to container
        for (let i = 0; i < numImages; i++) {
            url = pickRandomImage();
            
            // Create the image element
            const image = document.createElement("img");
            image.classList.add("img-fluid");
            image.style.maxWidth = "300px";
            image.style.maxHeight = "300px";
            image.style.boxShadow = "2px 2px #000";
            image.setAttribute("src", url);
            image.style.marginRight = "15px";

            imageContainer.appendChild(image);
        }
    }

}

function loadDefaultQuestions() {
    // reference to question metadata
    ref = metaRef.doc("QuizData");

    // get parent cointainer
    const parent = document.getElementById("defaultQuestionList");

    ref.get().then((doc) => {
        if (doc.exists) {
            const questionList = doc.data()["Questions"];
            // loop through array and get info for each quiz to display
            let index = 0;
            questionList.forEach((question) => {
                const questionText = question["QuestionText"];
                const questionType = question["QuestionType"];
                const multiImage = question["multi-Image"];
                
                const label = document.createElement("label");
                label.setAttribute("id", index++);
                label.setAttribute("data-value", questionType);
                label.setAttribute("multi-Image", multiImage);
                label.textContent = questionText;
                label.setAttribute("onchange", "toggleDefualtQuestion(this)");
                
                const input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.style.marginRight = "5px";
                
                label.insertBefore(input, label.firstChild);

                parent.appendChild(label);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

// Load the list of models from the database into the field
function loadModelList() {
    // reference to question metadata
    ref = metaRef.doc("PCG");

    // get parent cointainer
    const parent = document.getElementById("modelTypeForm");

    ref.get().then((doc) => {
        if (doc.exists) {
            const modelList = doc.data()["Models"];
            // loop through array and get info for each quiz to display
            let index = 0;
            modelList.forEach((model) => {

                const label = document.createElement("label");
                label.setAttribute("id", index++);
                label.setAttribute("data-value", model);
                label.textContent = model;
                label.setAttribute("onchange", "toggleModel(this)");
                
                const input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.style.marginRight = "5px";
                
                label.insertBefore(input, label.firstChild);

                parent.appendChild(label);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

// On change method for select model check boxes, when models are updated, update and pull images according to what the user selects
function toggleModel(element){
    
    const numImagesField = document.getElementById("numberOfImages"); // variable for number of images field
    const domainField = document.getElementById("domain2"); // variable for domain selected field
    
    // Check that valid numImages have been specified and domain is selected
    if (numImagesField.getAttribute("data-value") == "true" && domainField.value != "none") {
        numImages = numImagesField.value; 
        const modelForm = document.getElementById("modelTypeForm");
        let modelsToFetch = [];

        // add data-value of each model type to an array named modelsToFetch
        const children = modelForm.children;
        for (let i = 0; i < children.length; i++) {
            const checkbox = children[i].querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                modelsToFetch.push(children[i].getAttribute("data-value"));
            }
        }

        // Get limit of images for each model type (take total images they want and divide it by number of models they want)
        const limit = Math.ceil(numImages/modelsToFetch.length);

        imagePool = [];
        imagePoolLinks = [];
        
        // Get "limit" amount of images associated with each model, store them and their metadata in imagepool
        for (let i = 0; i < modelsToFetch.length; i++) {
            levelRef
            .where("model", "==", modelsToFetch[i]) //compound query to find the images of domain and model specified
            .where("domain", "==", domainField.value)
            .limit(limit) // limit documents fetched
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    imagePool.push(doc.id); //stores the id's to each image
                    imagePoolLinks.push(doc.data()["imageUrl"]); //stores the links for each image to be displayed
                });
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
            });
        }
    }
    console.log(imagePool);
}

// Function to ensure number of images requested is valid, turned red if invalid integer
function validateNumImages() {
    const numImagesField = document.getElementById("numberOfImages");
    let input = numImagesField.value;
    let min = 6;
    let max = 100;

    if (!input == "") {
        if (isPositiveInteger(input) && min <= input && input <= max) {
            numImagesField.style.backgroundColor = "white";
            numImagesField.setAttribute("data-value", "true");
        } else {
            numImagesField.style.backgroundColor = "#feb5b1";
            numImagesField.setAttribute("data-value", "false");
        }
    } else {
            numImagesField.style.backgroundColor = "white";
            numImagesField.setAttribute("data-value", "false");
    }
}

// Sub Function for validateNumImages to make sure no negative numbers of Images can be requested for a survey
function isPositiveInteger(str) {
    // Use a regular expression to check if the string is a positive integer 
    // The regular expression checks for one or more digits at the beginning of the string
    const regex = /^[1-9]\d*$/;
    return (regex.test(str));
  }

// Function to pick a random image from the pool
function pickRandomImage() {
  // Check if all items have been picked
  if (pickedImages.size === imagePool.length) {
    // Reset the Set
    pickedImages.clear();
  }

  let randomIndex;

  do {
    // Generate a random index within the range of available items
    randomIndex = Math.floor(Math.random() * imagePool.length);
    randomItem = imagePoolLinks[randomIndex];
  } while (pickedImages.has(randomIndex));

  // Mark the item as picked
  pickedImages.add(randomIndex);

  return randomItem;
}
