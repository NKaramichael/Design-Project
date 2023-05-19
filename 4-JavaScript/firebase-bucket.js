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
var LevelFirestore = db.collection('Levels');
var QuizFirestore = db.collection('Quizzes');

function displayCurrentQuizzes() {
  displayQuizzes("current");
};

function displayCompletedQuizzes() {
  displayQuizzes("completed");
};

function displayNewQuizzes() {
  displayQuizzes("new");
};

// Fetching and display the user's quizzes
function displayQuizzes(status) {
  var email = sessionStorage.getItem('email');
  // var email = 'meow10@catmail.com';
  Ref = UserFirestore.doc(email);

  if (status != 'new') {
    Ref.get()
      .then((doc) => {
        if (doc.exists) {
          const quizRefs = doc.data()[status+'Quizzes'];
          // loop through array and get info for each quiz to display
          quizRefs.forEach((name) => {
            const ref = QuizFirestore.doc(name);
            ref.get()
              .then((doc) => {
                if (doc.exists) {
                  // display the quiz block
                   createQuizBlock(doc.data(), status, doc.id);
                } else {
                  // The document doesn't exist
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                // An error occurred while retrieving the document
                console.log("Error getting document:", error);
              });
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }else {
    Ref.get()
      .then((doc) => {
        if (doc.exists) {
          const usedQuizRefs = doc.data()['completedQuizzes'].concat(doc.data()['currentQuizzes']);
          QuizFirestore.get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.exists && !usedQuizRefs.includes(doc.id)) {
                  // display the quiz block
                  createQuizBlock(doc.data(), status, doc.id);
                } else {
                  // The document doesn't exist or is already used
                  console.log("No such document!");
                }
              });
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
};

async function getLevelUrl(levelName) {
  const levelRef = LevelFirestore.doc(levelName);
  let url = '';
  
  try {
    const doc = await levelRef.get();
    if (doc.exists) {
      url = doc.data()['imageUrl'];
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting document");
  }
  
  return url;
};



async function createQuizBlock(data, status, id) {
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
  // get and set thumbnail link from storage

  const image = document.createElement("img");
  levelName = data["Images"][0];
  const url = await getLevelUrl(levelName);
  image.setAttribute("src", url)

  const title = document.createElement("h2");
  title.textContent = box.title;

  const description = document.createElement("p");
  description.textContent = box.description;
  
  textBox.appendChild(image);

  if (status == 'new'){
    const addButton = document.createElement("button");
    addButton.classList.add("button");
    addButton.style.backgroundColor = "rgb(65, 239, 65)";
    addButton.style.color = "white";
    addButton.textContent = "Add to Current";
    addButton.setAttribute('data-value', id);
    addButton.addEventListener("click", addToCurrent);
    textBox.appendChild(addButton);
  } else {
    const openButton = document.createElement("button");
    openButton.classList.add("button");
    openButton.style.backgroundColor = "rgb(65, 239, 65)";
    openButton.style.color = "white";
    openButton.textContent = "Open";
    openButton.setAttribute('data-value', id);
    openButton.addEventListener("click", openSurveyPage);
    textBox.appendChild(openButton);

    if (status == 'current') {
      const removeButton = document.createElement("button");
      removeButton.classList.add("button");
      removeButton.style.backgroundColor = "rgb(241, 16, 16)";
      removeButton.style.color = "white";
      removeButton.textContent = "Remove";
      removeButton.setAttribute('data-value', id);
      removeButton.addEventListener("click", removeFromCurrent);
      // Add the elements to the text box
      textBox.appendChild(removeButton);
    } 
  } 
  textBox.appendChild(title);
  textBox.appendChild(description);

  // Add the text box to the parent element
  parent.appendChild(textBox);
};

function addToCurrent(event) {
  const button = event.target;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.disabled = true;
  const name = button.getAttribute("data-value");
  var email = sessionStorage.getItem('email');
  Ref = UserFirestore.doc(email);
  Ref.update({
    currentQuizzes: firebase.firestore.FieldValue.arrayUnion(name)
  });
};

function removeFromCurrent(event) {
  const button = event.target;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.disabled = true;
  const name = button.getAttribute("data-value");
  var email = sessionStorage.getItem('email');
  Ref = UserFirestore.doc(email);
  Ref.update({
    currentQuizzes: firebase.firestore.FieldValue.arrayRemove(name)
  });
};

function openSurveyPage(event) {
  const button = event.target;
  const name = button.getAttribute("data-value");

  // Create the URL with query parameter
  const url = `surveyView.html?quizId=${name}`;

  // Redirect to the other HTML page
  window.location.href = url;
};

function openSurvey() {
  // Get the quizId from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('quizId');

  quizRef = QuizFirestore.doc(name)
  quizRef.get()
              .then((doc) => {
                if (doc.exists) {
                  // display the quiz block
                  displayHeader(doc.data());
                  displayImages(doc.data());
                } else {
                  // The document doesn't exist
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                // An error occurred while retrieving the document
                console.log("Error getting document:", error);
              });
  
};

async function displayImages(data) {
  // Get a reference to the parent container element
  const parentContainer = document.getElementById('imageContainer');

  // Create the outer row element
  const rowElement = document.createElement("div");
  rowElement.classList.add("row", "justify-content-center", "align-items-center");
  
  // Define an async function to be used inside the forEach loop
  const loadImage = async (levelName) => {
    // Create the column element
    const col = document.createElement("div");
    col.classList.add("col");
    
    // Create the image element
    const image = document.createElement("img");
    image.classList.add("img-fluid");
    image.style.maxWidth = "300px";
    image.style.maxHeight = "300px";
    image.style.boxShadow = "2px 2px #000";

    const url = await getLevelUrl(levelName);
    image.setAttribute("src", url)
    
    col.appendChild(image);
    rowElement.appendChild(col);
  };
  
  // Iterate over the image names and load them asynchronously
  for (const levelName of data['Images']) {
    await loadImage(levelName);
  }

  parentContainer.appendChild(rowElement);
};

async function displayHeader(data) {
  // Get a reference to the parent container element
  const headerContainer = document.getElementById("headerContainer");

  // Create the header elements
  const titleHeader = document.createElement("header");
  titleHeader.textContent = data['Title'];
  titleHeader.classList.add("header");

  const descriptionHeader = document.createElement("header");
  descriptionHeader.textContent = data['Description'];
  descriptionHeader.classList.add("header");

  // Append the header elements to the header container
  headerContainer.appendChild(titleHeader);
  headerContainer.appendChild(descriptionHeader);
  
};
