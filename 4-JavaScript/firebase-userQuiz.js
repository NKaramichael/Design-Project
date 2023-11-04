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
  var QuestionFirestore = db.collection('Questions');

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
  
  async function displayHeading(heading) {
    // Get a reference to the parent container element
    const headerContainer = document.getElementById("surveyHeading");

    headerContainer.innerHTML = heading;
  };

  async function displayHeading(heading) {
    // Get a reference to the parent container element
    const headerContainer = document.getElementById("surveyHeading");

    headerContainer.innerHTML = heading;
  };

  function openSurvey() {
    // Get the quizId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('quizId');
    const status = urlParams.get('status');
  
    if (status == 'completed') {
      submitButton = document.getElementById('submitButton')
      submitButton.disabled = true;
    }
  
    quizRef = QuizFirestore.doc(name)
    quizRef.get()
      .then((doc) => {
        if (doc.exists) {
          displayHeading(doc.data()[""]);
          displayImages(doc.data());
          navPanel(doc.data());
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

  async function submit() {
    const email = sessionStorage.getItem("email");
  
    // Get the quizId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
  
    await UserFirestore.doc(email).update({
      currentQuizzes: firebase.firestore.FieldValue.arrayRemove(quizId),
      completedQuizzes: firebase.firestore.FieldValue.arrayUnion(quizId)
    });
  
    window.location.href = "./completedUserBoard.html"
  };