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

alert('meow');
//initialise firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var UserFirestore = db.collection('Users');


function displayCurrentQuizzes() {
    // var email = sessionStorage.getItem('email');
    var email = 'meow10@catmail.com';

    userRef = UserFirestore.doc(email);
    userRef.get().then((doc) => {
        if (doc.exists) {
            alert("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
        }
    }).catch((error) => {
        alert("Error getting document:", error);
    });
}