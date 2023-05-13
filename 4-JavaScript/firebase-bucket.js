// Work in prgress to hamdle user generated conted eg images
//configuration for connecting to firebase database
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
// Create a child reference
var thumbsRef = storageRef.child('Levels/Thumbnails/testimage.jpeg').getDownloadURL()
.then((url) => {
  // `url` is the download URL
  // inserted into an <img> element
  var img = document.getElementById('image1');
  img.setAttribute('src', url);
})
.catch((error) => {
  // Handle any errors
});