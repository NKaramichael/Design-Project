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
  
// Creating custom upload button
const selectButton = document.getElementById('inputFileButton');
const fileInput = document.getElementById('fileInput');
let uploadButton;
let selectedFiles;

selectButton.addEventListener('click', () => {
fileInput.click(); // Trigger the file input click event
});

fileInput.addEventListener('change', (event) => {
    // Handle the selected files here
    selectedFiles = event.target.files;
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    uploadButton = document.getElementById("uploadImagesButton");
    const dropdownContainer = document.getElementById("dropdownContainer");
    
    if (selectedFiles.length != 0){
        imagePreviewContainer.innerHTML = '';
        uploadButton.style.display = "";
        dropdownContainer.style.display = "";
    }

    if(selectedFiles.length > 5){
        imagePreviewContainer.style.justifyContent = "flex-start";
    } else {
        imagePreviewContainer.style.justifyContent = "center";
    }
    
    for (let i = 0; i < selectedFiles.length; i++){
        const fileReader = new FileReader();
        const currFile = selectedFiles[i];

        // Read file as data URL
        fileReader.onload = function (e) {
            const imageUrl = e.target.result;

            // Create the image element
            const image = document.createElement("img");
            image.classList.add("img-fluid");
            image.style.maxWidth = "300px";
            image.style.maxHeight = "300px";
            image.style.marginRight = "10px";
            image.style.boxShadow = "2px 2px #000";
            image.setAttribute("src", imageUrl);
            image.setAttribute("position", "relative");

            imagePreviewContainer.appendChild(image);
        };

        // Read file as data URL
        fileReader.readAsDataURL(currFile);
    }
});

//initialise firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const metaRef = db.collection("Metadata");

const errorRedHex = "#fdd6d3";
  
// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

function addMeta(){
    // Get the modal and buttons
    const modal = document.getElementById('popupModal');
    const submitButton = document.getElementById('submitMeta');

    modal.style.display = 'block';

    // Close the modal when the close button is clicked
    // closeButton.addEventListener('click', function() {
    // modal.style.display = 'none';
    // });

    // Close the modal when the submit button is clicked and a value is entered
    // submitButton.addEventListener('click', function() {
    // const inputValue = document.getElementById('inputValue').value;
    // if (inputValue) {
    //     modal.style.display = 'none';
    // }
    // });

    // Close the modal if the user clicks outside the modal
    window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    });
}

function submitMetaData(){
    const modelRadio = document.getElementById("modelRadio");
    const domainRadio = document.getElementById("domainRadio");
    const inputField = document.getElementById("inputField");
    const newMeta = inputField.value.trim();
    const modal = document.getElementById('popupModal');

    // reference to question metadata
    ref = metaRef.doc("PCG");

    if (newMeta == ""){
        return;
    }

    if (modelRadio.checked){
        // Update the array field using arrayUnion
        ref.update({
            Models: firebase.firestore.FieldValue.arrayUnion(newMeta)
        })
        .then(() => {
        })
        .catch((error) => {
        console.error("Error adding element to the array:", error);
        });
    } else if (domainRadio.checked){
        // Update the array field using arrayUnion
        ref.update({
            Domains: firebase.firestore.FieldValue.arrayUnion(newMeta)
        })
        .then(() => {
        })
        .catch((error) => {
        console.error("Error adding element to the array:", error);
        });
    } else {
        return;
    }

    loadDomainList();
    loadModelList();
    modal.style.display = "none";
}

// On click for upload images button
async function upload(){
    const modelDropdown = document.getElementById("modelDropdown");
    const domainDropdown = document.getElementById("domainDropdown");

    let errorFlag = false;
    if (modelDropdown.value == "none"){
        modelDropdown.style.border = "5px solid " + errorRedHex;
        errorFlag = true;
    } else {
        modelDropdown.style.border = "";
    }
    if (domainDropdown.value == "none"){
        domainDropdown.style.border = "5px solid " + errorRedHex;
        errorFlag = true;
    } else {
        domainDropdown.style.border = "";
    }

    if (errorFlag){
        return;
    }

    const selectedModel = modelDropdown.value;
    const selectedDomain = domainDropdown.value;

    // Disable the buttons and dropdowns during spin
    uploadButton.disabled = true;
    modelDropdown.disabled = true;
    domainDropdown.disabled = true;
    selectButton.disabled = true;
    document.getElementById("dashButton").disabled = true;
    document.getElementById("openPopupButton").disabled = true;

    // Change button text to the loading icon
    uploadButton.innerHTML = '<img style="height: auto; max-height: 40px;" class="loading-icon" src="../Resources/loading.png" alt="Loading Spinner" id="spinner">';

    await uploadImages(selectedDomain, selectedModel);

    window.location.href = "researcher-dashboard.html";
}

// THESE FUNCTIONS ARE FOR UPLOADING IMAGES TO THE DATABASE
async function uploadImages(domain, model) {
    // Upload images to Firebase Storage and Firestore
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await uploadImage(file, domain, model);
    }

    // // Define an array to store all upload promises
    // const uploadPromises = [];

    // for (let i = 0; i < selectedFiles.length; i++) {
    //     const file = selectedFiles[i];
    //     const promise = uploadImage(file, domain, model);
    //     uploadPromises.push(promise);
    // }

    // try {
    //     // Use Promise.all to upload all images in parallel
    //     await Promise.all(uploadPromises);
    //     console.log('All images uploaded and saved in Firestore.');
    // } catch (error) {
    //     console.log('Error uploading images:', error);
    // }
}

async function uploadImage(file, domain, model) {
    try {
        // Generate a unique name for the file
        const uniqueFileName = Date.now() + '_' + Math.random().toString(36).substring(2);

        // Reference to the storage location with the unique file name
        const storageRef = storage.ref().child('Level/images/' + uniqueFileName);

        // Create the metadata object with custom metadata fields
        var metadata = {
            customMetadata: {
                domain: domain,
                model: model
            }
        };

        const email = sessionStorage.getItem("email");
        // Upload the image file to Firebase Storage with metadata
        await storageRef.put(file, metadata);

        // Get the download URL of the uploaded image
        var url = await storageRef.getDownloadURL();

        // Save the image URL and metadata in Cloud Firestore
        var docRef = await firestore.collection('Levels').add({
            researcher: email,
            imageUrl: url,
            domain: domain,
            model: model,
            score: {},
            appeared: {}
        });

        // sessionStorage.setItem(ref, docRef.id);
        console.log('Image URL and metadata saved in Firestore! Ref:', docRef.id);
    } catch (error) {
        console.log('Error uploading image:', error);
    }
}

function loadDomainList() {
    // reference to question metadata
    ref = metaRef.doc("PCG");

    // get parent cointainer
    const parent = document.getElementById("domainDropdown");
    const children = parent.children;

    while (children.length > 1) {
        // Check if there are more than one child elements
        const lastChild = children[children.length - 1];
        parent.removeChild(lastChild); // Remove the last child
    }

    ref.get().then((doc) => {
        if (doc.exists) {
            const domainList = doc.data()["Domains"];
            // loop through array and get info for each quiz to display
            domainList.forEach((domain) => {
                const option = document.createElement("option");
                option.setAttribute("value", domain);
                option.innerHTML = domain;
                option.style.fontStyle = "normal";

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
    const parent = document.getElementById("modelDropdown");
    const children = parent.children;

    while (children.length > 1) {
        // Check if there are more than one child elements
        const lastChild = children[children.length - 1];
        parent.removeChild(lastChild); // Remove the last child
    }

    ref.get().then((doc) => {
        if (doc.exists) {
            const modelList = doc.data()["Models"];
            // loop through array and get info for each quiz to display
            modelList.forEach((model) => {
                const option = document.createElement("option");
                option.setAttribute("value", model);
                option.innerHTML = model;
                option.style.fontStyle = "normal";

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
