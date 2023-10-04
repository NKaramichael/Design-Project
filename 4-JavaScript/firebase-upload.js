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
        await uploadImage(file, domain, model, i);
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

        // const ref = 'ref' + imageNum;
        // sessionStorage.setItem(ref, docRef.id);
        console.log('Image URL and metadata saved in Firestore! Ref:', docRef.id);
    } catch (error) {
        console.log('Error uploading image:', error);
    }
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
                label.setAttribute("onchange", "toggleModel()");

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