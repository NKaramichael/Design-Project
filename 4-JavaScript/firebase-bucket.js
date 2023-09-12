// Work in prgress to handle user generated conted eg images
// configuration for connecting to firebase database
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
  // var email = sessionStorage.getItem('email');
  var email = 'meow10@catmail.com';
  Ref = UserFirestore.doc(email);

  if (status != 'new') {
    Ref.get()
      .then((doc) => {
        if (doc.exists) {
          const quizRefs = doc.data()[status + 'Quizzes'];
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
  } else {
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
  // <div>
  //   <link href="./survey-card.css" rel="stylesheet" />
  //   <div class="survey-card-container">
  //     <div class="survey-card-gallery-card testimonal">
  //       <img
  //         alt="image"
  //         src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDEyfHxmb3Jlc3R8ZW58MHx8fHwxNjI2MjUxMjg4&amp;ixlib=rb-1.2.1&amp;w=1500"
  //         class="survey-card-image"
  //       />
  //       <h2 class="survey-card-text">Project Title</h2>
  //       <span class="survey-card-text1">Lorem ipsum dolor sit amet</span>
  //     </div>
  //   </div>
  // </div>

  // Get a reference to the container element
  // Get the parent element to which the text boxes will be added
  const parent = document.getElementById("container");

  const card = document.createElement("div");
  
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "/components/survey-card.css");
  parent.appendChild(link);
  
  const div1 = document.createElement("div")
  div1.setAttribute("class","survey-card-container");
  card.appendChild(div1);
  const div2 = document.createElement("div");
  div2.setAttribute("class", "survey-card-gallery-card testimonal");
  div1.appendChild(div2);

  const image = document.createElement("img");
  image.setAttribute("class", "survey-card-image");
  div2.appendChild(image);
  const title = document.createElement("h2");
  title.setAttribute("class", "survey-card-text");
  div2.appendChild(title);
  const description = document.createElement("span");
  description.setAttribute("class", "survey-card-text1");
  div2.appendChild(description);
  

  levelName = data["Images"][0];
  const url = await getLevelUrl(levelName);
  image.setAttribute("src", url)

  title.textContent = data['Title']
  description.textContent = data['Description']
  
  if (status == 'new') {
    const addButton = document.createElement("button");
    addButton.setAttribute("class", "user-dashboard-button");
    addButton.textContent = "Add to Current";
    addButton.setAttribute('data-value', id);
    addButton.addEventListener("click", addToCurrent);
    div2.appendChild(addButton);
  } else {
      const openButton = document.createElement("button");
      openButton.setAttribute("class", "user-dashboard-button");
      openButton.textContent = "Open";
      openButton.setAttribute('data-value', JSON.stringify([id, status]));
      div2.appendChild(openButton);
    
      if (status == 'completed') {
          openButton.addEventListener("click", openSurveyPage);
        }
        if (status == 'current') {
            openButton.addEventListener("click", openSurveyPage);
        
            const removeButton = document.createElement("button");
            removeButton.setAttribute("class", "user-dashboard-button");
            removeButton.textContent = "Remove";
            removeButton.setAttribute('data-value', id);
            removeButton.addEventListener("click", removeFromCurrent);
            // Add the elements to the text box
            div2.appendChild(removeButton);
          }
        }

        parent.appendChild(card);
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
  const dataValue = JSON.parse(button.getAttribute("data-value"));
  const name = dataValue[0];
  const status = dataValue[1];
  // Create the URL with query parameter
  const url = `surveyView.html?quizId=${name}&status=${status}`;

  // Redirect to the other HTML page
  window.location.href = url;
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
        // display the quiz block
        displayHeader(doc.data());
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

function createQuestion(type, questionText) {
  var details = questionText + " |";
  switch (type) {
    case "scale": details += ' Scale from 1 to 10';
      break;
    case "radioABC": details += ' Radio Type : A-B-C';
      break;
    case "radioAB": details += ' Radio Type : A-B';
      break;
    case "radioYN": details += ' Radio Type : Yes No';
      break;
    case "checkABC": details += ' Checkbox Type : A-B-C';
      break;
    case "checkAB": details += ' Checkbox Type : A-B';
      break;
  }

  const size = questions.length;
  list = { id: size + 1, text: 'Question ' + (size + 1), content: details };
  questions.push(list);

  var newQuestion = document.createElement('li');
  newQuestion.textContent = list.content;
  var questionList = document.getElementById('questionList');
  questionList.appendChild(newQuestion);

  // Get references to the navigation panel and container elements
  const navPanel = document.getElementById('nav-panel');
  const container = document.getElementById('container');

  // Clear the navPanel
  while (navPanel.firstChild) {
    navPanel.removeChild(navPanel.firstChild);
  }

  // Generate the HTML for the navigation panel dynamically
  questions.forEach(question => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.questionId = question.id;
    a.textContent = question.text;
    li.appendChild(a);
    navPanel.appendChild(li);
  });

  // Add event listeners to the navigation panel elements
  navPanel.addEventListener('click', event => {
    if (event.target.matches('[data-question-id]')) {
      event.preventDefault();
      const questionId = event.target.dataset.questionId;
      const question = questions.find(q => q.id === parseInt(questionId));
      container.innerHTML = "";
      container.innerHTML = question.content;
      container.style.border = "10px solid #000000";
      container.style.borderRadius = " 50px";
      container.style.backgroundColor = "#000000";
    }
  });
};

async function navPanel(docData) {
  try {
    const questions = [];

    const questionNames = docData.Questions;
    const navPanel = document.getElementById('nav-panel');
    const container = document.getElementById('container');

    await QuestionFirestore.where(firebase.firestore.FieldPath.documentId(), 'in', questionNames).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((questionDoc) => {
          const questionData = questionDoc.data();
          const questionText = questionData.Description;
          const questionType = questionData.Type;
          const size = questions.length;
          const list = { id: questionDoc.id, text: 'Question ' + (size + 1), content: questionText, type: questionType };
          questions.push(list);
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#';
          a.dataset.questionId = questionDoc.id;
          a.textContent = list.text;
          li.appendChild(a);
          navPanel.appendChild(li);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    navPanel.addEventListener('click', (event) => {
      if (event.target.matches('[data-question-id]')) {
        event.preventDefault();
        const questionId = event.target.dataset.questionId;
        const question = questions.find((q) => q.id === questionId);
        container.innerHTML = generateQuestionContent(question.content, question.type);
      }
    });
  } catch (error) {
    console.log("Error fetching question documents:", error);
  }
};

function generateQuestionContent(description, type) {
  let questionContent = '';

  if (type === 'Scale from 1 to 10') {
    questionContent = `
      <label for="scaleSlider">${description} <br> Rate from 1 to 10:</label>
      <input type="range" min="1" max="10" step="1" id="scaleSlider">
      <output for="scaleSlider" id="scaleOutput"></output>
    `;
  } else if (type === 'Radio Type : A-B') {
    questionContent = `
      <label for="radioAB">${description} <br> Choose A or B:</label>
      <input type="radio" id="radioA" name="radioAB" value="A">
      <label for="radioA">A</label>
      <input type="radio" id="radioB" name="radioAB" value="B">
      <label for="radioB">B</label>
    `;
  } else if (type === 'Checkbox Type : A-B-C') {
    questionContent = `
      <label for="checkboxABC">${description} <br> Choose one or more:</label>
      <input type="checkbox" id="checkboxA" name="checkboxABC" value="A">
      <label for="checkboxA">A</label>
      <input type="checkbox" id="checkboxB" name="checkboxABC" value="B">
      <label for="checkboxB">B</label>
      <input type="checkbox" id="checkboxC" name="checkboxABC" value="C">
      <label for="checkboxC">C</label>
    `;
  } else if (type === 'Radio Type : A-B-C') {
    questionContent = `
      <label for="radioABC">${description} <br> Choose A, B, or C:</label>
      <input type="radio" id="radioA" name="radioABC" value="A">
      <label for="radioA">A</label>
      <input type="radio" id="radio
      <input type="radio" id="radioB" name="radioABC" value="B">
      <label for="radioB">B</label>
      <input type="radio" id="radioC" name="radioABC" value="C">
      <label for="radioC">C</label>
    `;
  } else if (type === 'Checkbox Type : A-B') {
    questionContent = `
      <label for="checkboxAB">${description} <br> Choose one or more:</label>
      <input type="checkbox" id="checkboxA" name="checkboxAB" value="A">
      <label for="checkboxA">A</label>
      <input type="checkbox" id="checkboxB" name="checkboxAB" value="B">
      <label for="checkboxB">B</label>
    `;
  } else if (type === 'Radio Type : Yes No') {
    questionContent = `
      <label for="radioYesNo">${description} <br> Choose Yes or No:</label>
      <input type="radio" id="radioYes" name="radioYesNo" value="Yes">
      <label for="radioYes">Yes</label>
      <input type="radio" id="radioNo" name="radioYesNo" value="No">
      <label for="radioNo">No</label>
    `;
  }

  return questionContent;
};

// Handle filter button click event
function handleFilter() {

  const levelsCollection = firebase.firestore().collection("Levels");

  // Retrieve the selected filter model
  const filterModel = document.getElementById("modelSelect").value;

  // Clear previous result
  const imageContainer = document.getElementById("imageContainer");
  imageContainer.innerHTML = "";
  console.log("HI")
  // Perform Firestore query
  levelsCollection.where("model", "==", filterModel)
    .get()
    .then((querySnapshot) => {
      // Process the query results
      querySnapshot.forEach((doc) => {
        // Get the imageUrl from the document
        const data = doc.data();
        const imageUrl = data.imageUrl;

        // Display the image in the UI
        const img = document.createElement("img");
        img.src = imageUrl;
        imageContainer.appendChild(img);
      });
    })
    .catch((error) => {
      console.error("Error retrieving filtered documents: ", error);
    });
};

function fetchQuizzesByResearcher() {
  const email = sessionStorage.getItem('email');

  QuizFirestore.where('Researcher', '==', email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        const quizData = doc.data();
        const quizId = doc.id;

        // Call the displayQuiz function to render the quiz
        displayQuiz(quizData, quizId);
      });
    })
    .catch((error) => {
      console.log("Error getting quizzes: ", error);
    });
};

async function displayQuiz(data, id) {
  // Example implementation: Create an HTML element to display the quiz
  const quizContainer = document.createElement('div');
  // define values for the box
  const box = {
    title: data.Title,
    description: data.Description
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

  textBox.appendChild(title);
  textBox.appendChild(description);

  // Add the text box to the parent element
  parent.appendChild(textBox);

  // Append the quiz container to the document body or a specific element
  document.body.appendChild(quizContainer);
  console.log(data)
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
