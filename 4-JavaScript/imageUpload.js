// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDPhBs6YrLXQspg8krTemU6WdlArx4lNQ4",
    authDomain: "pcgevaluation-49d75.firebaseapp.com",
    databaseURL: "https://pcgevaluation-49d75-default-rtdb.firebaseio.com",
    projectId: "pcgevaluation-49d75",
    storageBucket: "pcgevaluation-49d75.appspot.com",
    messagingSenderId: "369543877095",
    appId: "1:369543877095:web:84e7d5c5fdb84dd72eed42"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

function uploadImage(file,domain,model) {

    // Create a storage reference for the image file
    var storageRef = storage.ref().child('Level/images/' + file.name);

    // Upload the image file to Firebase Storage
    storageRef.put(file).then(function (snapshot) {
        console.log('Image uploaded successfully!');

        // Get the download URL of the uploaded image
        storageRef.getDownloadURL().then(function (url) {
            console.log('Image URL:', url);

            // Save the image URL in Cloud Firestore
            firestore.collection('Levels').add({
                imageUrl: url,
                domaingame: domain,
                model: model


            }).then(function (docRef) {
                console.log('Image URL saved in Firestore!');
            });
        });
    });
}