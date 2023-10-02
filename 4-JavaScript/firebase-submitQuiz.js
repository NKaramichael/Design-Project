
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
    
    let questionText = "";
    questionTextForm.textContent = questionText;
    
    // TODO: set all question preview elements to default state


}



function selectQuestion(button) {
    const questionTextForm = document.getElementById("questionPreview");
    const defaultQuestionList = document.getElementById("defaultQuestionList");

    let questionText = defaultQuestionList.querySelector(`label[id="${button.id}"]`).textContent;
    questionTextForm.textContent = questionText;
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
                
                const label = document.createElement("label");
                label.setAttribute("id", index++);
                label.setAttribute("data-value", questionType);
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

// function togglemodel(element){
//     // Find the checkbox element within the label
//     const checkbox = element.querySelector('input[type="checkbox"]');
//     const currentForm = document.getElementById("currentQuestionList");

//     if (checkbox) {
//         if (checkbox.checked) {
//             const label = document.createElement("label");
//             label.setAttribute("id", element.id);
//             label.setAttribute("data-value", element.getAttribute("data-value"));
//             label.textContent = element.textContent;
//             // label.setAttribute("onchange", "toggleDefualtQuestion(this)");

//             currentForm.appendChild(label);
//         } else {
//             const labelElement = currentForm.querySelector(`label[id="${element.id}"]`);
//             if (labelElement) {
//                 labelElement.remove();
//             } else {
//                 console.log("Warning: Label was never added to current");
//             }
//         }
//     } else {
//         console.log("Checkbox not found");
//     }
// }

function validateNumImages() {
    console.log("meow");
    const numImagesField = document.getElementById("numberOfImages");
    let input = numImagesField.value;
    let min = 6;
    let max = 100;

    if (isPositiveInteger(input) && min <= input && input <= max) {
        numImagesField.style.color = "black";
        numImagesField.setAttribute("data-value", "true");
    } else {
        numImagesField.style.color = "red";
        numImagesField.setAttribute("data-value", "false");
    }

}

function isPositiveInteger(str) {
    // Use a regular expression to check if the string is a positive integer 
    // The regular expression checks for one or more digits at the beginning of the string
    const regex = /^[1-9]\d*$/;
    return (regex.test(str));
  }
