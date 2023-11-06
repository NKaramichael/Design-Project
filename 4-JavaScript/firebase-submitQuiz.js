// THIS JAVASCRIPT IS FOR WHEN RESEARCHERS ARE CREATING THEIR SURVEYS
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
var QuizRef = db.collection("Quizzes");
var metaRef = db.collection("Metadata");
var levelRef = db.collection("Levels");
var researcherRef = db.collection("Researchers");

var imagePool = [];
var imagePoolLinks = [];
const pickedImages = new Set();
var weights = {};
const errorRedHex = "#fdd6d3";

// Restyles the image container if there are too many images in the container
function checkOverflow(imageDiv) {
    if (imageDiv.scrollWidth > imageDiv.clientWidth) {
        imageDiv.style.justifyContent = 'flex-start'; // Content overflows, align left
    } else {
        imageDiv.style.justifyContent = 'center'; // Content fits, center it
    }
}

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
function submit() {
    // Checking that heading and description are filled in
    const headingField = document.getElementById('heading');
    const descriptionField = document.getElementById('description');
    const numImagesField = document.getElementById("numberOfImages");
    const domainField = document.getElementById("domainForm");
    const modelField = document.getElementById("modelTypeForm");
    const defaultQuestionList = document.getElementById("defaultQuestionList");
    const navBar = document.getElementById("navBar");
    const questionTextForm = document.getElementById("questionPreview");

    const heading = headingField.value;
    const desc = descriptionField.value;
    const domain = domainField.value;
    const questions = getCheckedFromContainer(defaultQuestionList);
    const models = getCheckedFromContainer(modelField);
    const researcher = sessionStorage.getItem('email');

    let errorFlag = true;

    if (heading == "") {
        headingField.style.backgroundColor = errorRedHex; // turn the field red, return to stop submit
        errorFlag = false;
    }
    if (desc == "") {
        descriptionField.style.backgroundColor = errorRedHex; // turn the field red, return to stop submit
        errorFlag = false;
    }
    if (domain == "none") {
        domainField.style.border = '1px solid ' + errorRedHex;
        errorFlag = false;
    }
    if (questions.length == 0) {
        defaultQuestionList.style.backgroundColor = errorRedHex;
        errorFlag = false;
    }
    if (models.length == 0) {
        modelField.style.backgroundColor = errorRedHex;
        errorFlag = false;
    }
    if (numImagesField.getAttribute("data-value") == "false") {
        numImagesField.style.backgroundColor = errorRedHex;
        errorFlag = false;
    }
    if (imagePool.length == 0) errorFlag = false;
    // check that weights are all filled
    for (key in weights) {
        const weight = weights[key];
        if (isNaN(parseFloat(weight))){
            const navButton = navBar.querySelector(`button[data-id="${key}"]`);
            if (navButton) {
                navButton.style.backgroundColor = errorRedHex;
            }
            questionTextForm.textContent = "Please set numerical weights for all questions";
            questionTextForm.style.color = errorRedHex;
            errorFlag = false;
        }  
    }

    if (!errorFlag) return;

    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    submitButton.innerHTML = '<img style="height: auto; max-height: 40px;" class="loading-icon" src="../Resources/loading.png" alt="Loading Spinner" id="spinner">';

    // Disable all the elements
    headingField.disabled = true;
    descriptionField.disabled = true;
    numImagesField.disabled = true;
    domainField.disabled = true;
    modelField.disabled = true;
    defaultQuestionList.disabled = true;

    var data = {
        Description: desc,
        Title: heading,
        Status: true,
        Researcher: researcher,
        Domain: domain,
        Models: models,
        Questions: questions,
        Levels: imagePool,
        Weights: weights || {}
    };

    const currentResearcher = researcherRef.doc(researcher); 

    // Once the data is added to the quiz collection, get a reference to its name and add it to the researchers collection under the researchers name
    QuizRef.add(data)
        .then((quizDocRef) => {
            const quizName = quizDocRef.id;
            
            // Create a subcollection "Responses" under the newly created document
            return quizDocRef.collection("Responses").add({
                // You can add initial data to the "Responses" subcollection here if needed
            }).then(() => {
                // Update the mySurveys field with the reference to the new quiz
                return currentResearcher.update({
                    mySurveys: firebase.firestore.FieldValue.arrayUnion(quizName)
                });
            });
        })
        .then(() => {
            window.location.href = "../New UI/researcher-dashboard.html";
        })
    .catch((error) => {
        console.error("Error adding document to Quizzes or updating Researcher Collection: ", error);
    });

}

function getCheckedFromContainer(container) {
    let checked = [];
    labels = container.children;
    for (let i = 0; i < labels.length; i++) {
        checkbox = labels[i].querySelector("input[type=checkbox]");
        if (checkbox.checked) { checked.push(labels[i].id) }
    }
    return checked;
}

// function to make sure heading is not empty
function validateHeading() {
    const heading = document.getElementById("heading");
    heading.style.backgroundColor = "white";
}

// function to make sure description is not empty
function validateDescription() {
    const description = document.getElementById("description");
    description.style.backgroundColor = "white";
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

function toggleDefualtQuestion(element) {
    // Find the checkbox element within the label
    const checkbox = element.querySelector('input[type="checkbox"]');
    const navBar = document.getElementById("navBar");

    if (checkbox) {
        if (checkbox.checked) {
            const button = document.createElement("button");

            button.setAttribute("class", "navBar-button");
            button.setAttribute("id", element.id);
            button.setAttribute("data-id", element.id);
            button.setAttribute("data-value", element.getAttribute("data-value"));
            button.setAttribute("onclick", "selectQuestion(this)");

            navBar.appendChild(button);
            setIndeces(navBar);
            selectQuestion(navBar.querySelector(`button[id="${element.id}"]`))

            weights[questionText] = "";
        } else {
            // Delete the weight entry
            delete weights[questionText];
            const buttonElement = navBar.querySelector(`button[id="${element.id}"]`);
            if (buttonElement) {
                buttonElement.remove();
                setIndeces(navBar);
                if (element.id - 1 >= 0) {
                    selectQuestion(navBar.querySelector(`button[id="${element.id - 1}"]`));
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
    const answerFieldContainer = document.getElementById("answerFieldContainer");
    const weightInput = document.getElementById("weightInput");


    let question = defaultQuestionList.querySelector(`label[id="${button.id}"]`);
    let questionText = question.textContent;
    let questionType = question.getAttribute("data-value");
    let isMulti = question.getAttribute("MultiImage");
    let numImages = 0;

    button.style.backgroundColor = "transparent";

    // save weight before updating text content
    setWeight(weightInput);

    // SET QUESTION TEXT
    questionTextForm.style.color = "white";
    questionTextForm.textContent = questionText;

    // autofill weight container
    fillWeightContainer(weightInput);

    // DISPLAY IMAGES
    if (imagePool.length != 0) {
        numImages = 1;

        // Loop through and remove all child nodes
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }
        const min = 2;
        const max = 6;

        //  set random number of images for multi question
        if (isMulti == "true") {
            numImages = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // get random images from pool and add to container
        for (let i = 0; i < numImages; i++) {
            const imageIndex = pickRandomImage();

            // Create a container for each image and label
            const imageAndLabelContainer = document.createElement("div");
            imageAndLabelContainer.style.textAlign = "center"; // Center align the contents
            imageAndLabelContainer.style.marginRight = "15px";

            // Create the image element
            const image = document.createElement("img");
            image.classList.add("img-fluid");
            image.style.maxWidth = "300px";
            image.style.maxHeight = "300px";
            image.style.boxShadow = "2px 2px #000";
            image.setAttribute("src", imagePoolLinks[imageIndex]);
            image.setAttribute("data-value", imagePool[imageIndex]);

            // Append the image and label to the container
            imageAndLabelContainer.appendChild(image);

            if (isMulti == "true") {

                const label = document.createElement("span");
                label.textContent = String.fromCharCode(65 + i); // 'A', 'B', 'C', ...

                // Add styling to the label
                label.style.fontSize = "22px";
                label.style.fontWeight = "bold";
                label.style.color = "white";
                label.style.marginTop = "15px"; // Add spacing between image and label

                imageAndLabelContainer.appendChild(label);
            }

            // Append the container to the imageContainer
            imageContainer.appendChild(imageAndLabelContainer); // display image and label on-screen

            checkOverflow(imageContainer)
        }
    }

    // Display answer fields, scales with number of images in a given question
    if (numImages != 0) {
        // Loop through and remove all child nodes
        while (answerFieldContainer.firstChild) {
            answerFieldContainer.removeChild(answerFieldContainer.firstChild);
        }

        if (questionType == "scale") { // Display a scale for a singular image question
            //  If scale we know question is single image
            let scaleContainer = document.createElement("div");
            scaleContainer.style.textAlign = "center";
            scaleContainer.style.width = "25%";

            const scale = document.createElement("input");
            scale.setAttribute("data-value", questionType);
            scale.addEventListener("input", function () { setScaleNumber(this) });
            scale.value = "5";
            scale.type = "range";
            scale.min = "0";
            scale.max = "10";
            scale.step = "1";
            scale.id = "scaleInput";
            scale.style.width = "100%";

            const label = document.createElement("label");
            label.setAttribute("id", questionType);
            label.setAttribute("data-value", questionType);
            label.setAttribute("for", scale.id);
            label.textContent = scale.value;
            label.style.color = "white";

            scaleContainer.appendChild(scale);
            scaleContainer.appendChild(label);
            answerFieldContainer.appendChild(scaleContainer);

        }
        else { // Display either a checkbox or a radio button type for multi image question
            for (let index = 0; index < numImages; index++) {
                //  If not scale we know question is multi image
                const label = document.createElement("label");
                label.setAttribute("id", index);
                label.setAttribute("data-value", questionType);
                label.setAttribute("onchange", "answerToggle(this)");
                label.textContent = String.fromCharCode(65 + index);
                label.style.color = "white";
                label.style.marginRight = "15px"; // Add spacing between buttons

                const input = document.createElement("input");
                input.setAttribute("type", questionType);
                input.style.marginRight = "5px";

                label.insertBefore(input, label.firstChild);

                answerFieldContainer.appendChild(label);
            }
        }
    }
}

// function to get the number on the scale and update the label with it
function setScaleNumber(element) {
    const label = element.labels[0];
    label.textContent = element.value;
}

// This function ensures that only 1 radio button can br pressed at a time, ignores if its a checkbox
function answerToggle(element) {
    const parent = element.parentNode;
    if (element.getAttribute("data-value") == "radio") {
        const children = parent.children;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] != element) {
                const radio = children[i].querySelector('input[type="radio"]');
                radio.checked = false;
            }
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
            for (const [questionText, question] of Object.entries(questionList)) {
                const questionType = question["QuestionType"];
                const MultiImage = question["MultiImage"];

                const label = document.createElement("label");
                label.setAttribute("id", questionText);
                label.setAttribute("data-value", questionType);
                label.setAttribute("MultiImage", MultiImage);
                label.textContent = questionText;
                label.setAttribute("onchange", "toggleDefualtQuestion(this)");

                const input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.style.marginRight = "5px";

                label.insertBefore(input, label.firstChild);

                parent.appendChild(label);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

function loadDomainList() {
    // reference to question metadata
    ref = metaRef.doc("PCG");

    // get parent cointainer
    const parent = document.getElementById("domainForm");
    parent.setAttribute("onchange", "updateImagePool()");

    ref.get().then((doc) => {
        if (doc.exists) {
            const domainList = doc.data()["Domains"];

            // loop through array and get info for each quiz to display
            domainList.forEach((domain) => {
                const option = document.createElement("option");
                option.setAttribute("value", domain);
                option.textContent = domain;

                parent.appendChild(option);
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
            modelList.forEach((model) => {

                const label = document.createElement("label");
                label.setAttribute("id", model);
                label.setAttribute("data-value", model);
                label.textContent = model;
                label.setAttribute("onchange", "updateImagePool()");

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

// Function to ensure number of images requested is valid, turned red if invalid integer
function updateImagePool() {
    const numImagesField = document.getElementById("numberOfImages");
    let input = numImagesField.value;
    let min = 6;
    let max = 100;

    if (!input == "") {
        if (isPositiveInteger(input) && min <= input && input <= max) {
            numImagesField.style.backgroundColor = "white";
            numImagesField.setAttribute("data-value", "true");
            fetchImages();
        } else {
            numImagesField.style.backgroundColor = errorRedHex;
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
    } while (pickedImages.has(randomIndex));

    // Mark the item as picked
    pickedImages.add(randomIndex);

    return randomIndex;
}

async function fetchImages(){
    const numImagesField = document.getElementById("numberOfImages"); // variable for number of images field
    const domainField = document.getElementById("domainForm"); // variable for domain selected field
    const modelForm = document.getElementById("modelTypeForm");

    disableContainerCheckboxes(modelForm);

    // Check that valid numImages have been specified and domain is selected
    if (numImagesField.getAttribute("data-value") == "true"  && domainField.value != "none") {
        const numImages = numImagesField.value;
        
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
        const limit = Math.ceil(numImages / modelsToFetch.length);
        const researcher = sessionStorage.getItem("email");

        imagePool = [];
        imagePoolLinks = [];

        // Get "limit" amount of images associated with each model, store them and their metadata in imagepool
        for (let i = 0; i < modelsToFetch.length; i++) {
            var modelImages = []
            var modelImageLinks = []

            await levelRef
                .where("researcher", "==", researcher)
                .where("model", "==", modelsToFetch[i]) //compound query to find the images of domain and model specified
                .where("domain", "==", domainField.value)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        modelImages.push(doc.id); //stores the id's to each image
                        modelImageLinks.push(doc.data()["imageUrl"]); //stores the links for each image to be displayed
                    });
                })
                .catch((error) => {
                    console.error('Error getting documents: ', error);
                });

            var counter = 0;
            while (counter < limit && modelImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * modelImages.length);
                imagePool.push(modelImages[randomIndex]);
                imagePoolLinks.push(modelImageLinks[randomIndex]);
                modelImages.splice(randomIndex, 1);
                modelImageLinks.splice(randomIndex, 1);
                counter++;
            }

        }
    }
    enableContainerCheckboxes(modelForm);
    console.log(imagePool);
}

function disableContainerCheckboxes(parent) {
    for (const child of parent.children) {
        child.firstChild.disabled = true;
    }
}

function enableContainerCheckboxes(parent) {
    for (const child of parent.children) {
        child.firstChild.disabled = false;
    }
}

function setWeight(container) {
    const questionTextForm = document.getElementById("questionPreview");
    questionText = questionTextForm.textContent;

    // do checks here maybe or later?
    if (questionText == "") return;

    weights[questionText] = container.value;
}

function fillWeightContainer(container) {
    const questionTextForm = document.getElementById("questionPreview");
    questionText = questionTextForm.textContent;

    if (questionText in weights) {
        container.value = weights[questionText];
    }
}