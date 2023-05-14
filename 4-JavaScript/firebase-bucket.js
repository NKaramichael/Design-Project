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

//firestore references
const db = firebase.firestore();
var UserFirestore = db.collection('Users');
var ResearcherFirestore = db.collection('Researchers');

function displayCurrentQuizzes() {
  displayQuizzes("current");
};

function displayCompletedQuizzes() {
  displayQuizzes("completed");
};

// Fetchg and diosplay the user's quizzes
function displayQuizzes(status) {
  var email = sessionStorage.getItem('email');
  // var email = 'meow10@catmail.com';
  Ref = UserFirestore.doc(email);
  // query database for array of currently active quizzes
  Ref.get().then((doc) => {
      if (doc.exists) {
        quizRefs = (doc.data()[status+'Quizzes']);
        // loop through array and get info for each quiz to display
        quizRefs.forEach((ref) => {
          ref.get().then((doc) => {
              if (doc.exists) {
                // display the quiz block
                createQuizBlock(doc.data());
              } else {
                  // The document doesn't exist
                  console.log("No such document!");
              }
          }).catch((error) => {
              // An error occurred while retrieving the document
              console.log("Error getting document:", error);
          });
      });
      } else {
          // doc.data() will be undefined in this case
          alert("No such document!");
      }
  }).catch((error) => {
      alert("Error getting document:", error);
  });
};

async function createQuizBlock(data) {
  // define values for the box
  const box = {
    title: data['Title'],
    description: data['Description']
  };
  // Get a reference to the container element
  // Get the parent element to which the text boxes will be added
  const parent = document.getElementById("text-boxes");

  const textBox = document.createElement("div");
  textBox.classList.add("text-box");
  // get and set thumbnail link froim storage
  parentDirec = 'Levels/Thumbnails/'
  const image = document.createElement("img");
  await storageRef.child(parentDirec+data['Thumbnail']).getDownloadURL()
  .then((url) => {
    // `url` is the download URL\
    image.setAttribute("src", url);
  })
  .catch((error) => {
    // Handle any errors
    console.log(error)
  });

  const title = document.createElement("h2");
  title.textContent = box.title;

  const description = document.createElement("p");
  description.textContent = box.description;

  const openButton = document.createElement("button");
  openButton.classList.add("button");
  openButton.style.backgroundColor = "rgb(65, 239, 65)";
  openButton.style.color = "white";
  openButton.textContent = "Open";
  openButton.addEventListener("click", openSurvey);

  const removeButton = document.createElement("button");
  removeButton.classList.add("button");
  removeButton.style.backgroundColor = "rgb(241, 16, 16)";
  removeButton.style.color = "white";
  removeButton.textContent = "Remove";

  // Add the elements to the text box
  textBox.appendChild(image);
  textBox.appendChild(openButton);
  textBox.appendChild(removeButton);
  textBox.appendChild(title);
  textBox.appendChild(description);

  // Add the text box to the parent element
  parent.appendChild(textBox);
};