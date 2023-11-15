// It is the bucket. It does the bucket
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

var defaultButtonColor = '#161940';

// Add an event listener to check for overflow on window resize
window.addEventListener('resize', resize);
function resize() {if (removedPlaceholder) document.getElementById("sideContainer").style.height = '100vh';}

//firestore references
const db = firebase.firestore();
var UserFirestore = db.collection('Users');
var ResearcherFirestore = db.collection('Researchers');
var LevelFirestore = db.collection('Levels');
var QuizFirestore = db.collection('Quizzes');
var QuestionFirestore = db.collection('Questions');

function showModelFilter(){
  // const modelButton = document.getElementById('modelButton');
  // modelButton.style.backgroundColor = "green";
  
};

function showDomainFilter(){

};

function displayCurrentQuizzes() {
  // Need to clear container for when pages are switched between
  container = document.getElementById("container");
  // Remove all child elements from the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  displayQuizzes("current");
};

function displayCompletedQuizzes() {
  // Need to clear container for when pages are switched between
  container = document.getElementById("container");
  // Remove all child elements from the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  displayQuizzes("completed");
};

function displayNewQuizzes() {
  // clear container for when pages are switched between
  container = document.getElementById("container");
  // Remove all child elements from the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  displayQuizzes("new");
};

// Fetching and display the user's quizzes
async function displayQuizzes(status) {
  var email = sessionStorage.getItem('email');
  let surveyExists = false;

  const Ref = UserFirestore.doc(email);

  try {
    if (status != 'new') {
      const doc = await Ref.get();

      if (doc.exists) {
        
        const quizRefs = doc.data()[status + 'Quizzes'];

        // Create an array of promises to fetch quiz data
        const quizPromises = quizRefs.map(async (name) => {
          const ref = QuizFirestore.doc(name);
          const quizDoc = await ref.get();
          if (quizDoc.exists) {
            // display the quiz block
            surveyExists = true;
            createQuizBlock(quizDoc.data(), status, quizDoc.id);
          } else {
            // The document doesn't exist
            console.log("No such document!");
          }
        });

        await Promise.all(quizPromises);
      } else {
        console.log("No such document!");
      }
    } else {
      const doc = await Ref.get();

      if (doc.exists) {
        
        const usedQuizRefs = doc.data()['completedQuizzes'].concat(doc.data()['currentQuizzes']);
        const querySnapshot = await QuizFirestore.where("Status", "==", true).get();

        querySnapshot.forEach((doc) => {
          if (doc.exists && !usedQuizRefs.includes(doc.id)) {
            // display the quiz block
            surveyExists = true;
            createQuizBlock(doc.data(), status, doc.id);
          } else {
            // The document doesn't exist or is already used
            console.log("No such document!");
          }
        });
      } else {
        console.log("No such document!");
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  // Rest of the code remains the same

  // if there are no surveys to display, tell the user to add some
  if (!surveyExists) {
    // Create an empty div to add space above the text
    const spaceDiv = document.createElement("div");
    spaceDiv.style.height = "50vh";

    const email = sessionStorage.getItem("email");
    const parent = document.getElementById("container");
    const title = document.createElement("h1");
    title.setAttribute("style", "color: white;");
    title.textContent = `Oops! No surveys to see here...`;
    parent.appendChild(spaceDiv);
    parent.appendChild(title);

    const helpText = document.createElement("h3");
    helpText.setAttribute("style", "color: white; font-weight: normal;");
    helpText.textContent = `Be sure to use the user panel to start and complete surveys`;
    parent.appendChild(helpText);
  }
}


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

// Function to create each survey item popup
async function createQuizBlock(data, status, id) {
  // Get the parent element to which the text boxes will be added
  const parent = document.getElementById("container");

  const card = document.createElement("div");

  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "../New UI/components/survey-card.css");
  parent.appendChild(link);

  const div1 = document.createElement("div")
  div1.setAttribute("class", "survey-card-container");
  card.appendChild(div1);

  const div2 = document.createElement("div");
  div2.setAttribute("class", "survey-card-gallery-card testimonal");
  div2.style.paddingBottom = "6rem";

  div1.appendChild(div2);

  // add desc, image, title to card element
  const title = document.createElement("h2");
  title.setAttribute("class", "survey-card-text");
  div2.appendChild(title);

  const image = document.createElement("img");
  image.setAttribute("class", "survey-card-image");
  div2.appendChild(image);

  const description = document.createElement("span");
  description.setAttribute("class", "survey-card-text1");
  div2.appendChild(description);

  levelName = data["Levels"][0];
  const url = await getLevelUrl(levelName);
  image.setAttribute("src", url)

  title.textContent = data['Title']
  description.textContent = data['Description']

  if (status == 'new') {
    const addButton = document.createElement("button");
    addButton.setAttribute("class", "card-button");
    addButton.textContent = "Add to Current";
    addButton.setAttribute('data-value', id);
    addButton.addEventListener("click", addToCurrent);
    div2.appendChild(addButton);
  } else {
    const openButton = document.createElement("button");
    openButton.setAttribute("class", "card-button");
    openButton.textContent = "Open";
    openButton.setAttribute('data-value', JSON.stringify([id, status]));

    if (status == 'current') {
      div2.appendChild(openButton);
    }
   
    if (status == 'current') {
      openButton.addEventListener("click", openSurveyPage);

      const removeButton = document.createElement("button");
      removeButton.setAttribute("class", "user-dashboard-button");
      removeButton.textContent = "Remove";
      removeButton.setAttribute('data-value', id);
      removeButton.style.marginTop = "1rem"
      removeButton.style.marginBottom = "1rem"
      removeButton.addEventListener("click", removeFromCurrent);
      // Add the elements to the text box
      div2.appendChild(removeButton);
    }
  }

  parent.appendChild(card);
};

// function to add a survey to a users current page on "add to current" click
function addToCurrent(event) {
  const button = event.target;
  button.innerHTML = '<i class="fas fa-check"></i>'; // change text to a tick
  button.disabled = true;
  const name = button.getAttribute("data-value");
  var email = sessionStorage.getItem('email');
  Ref = UserFirestore.doc(email);
  Ref.update({
    currentQuizzes: firebase.firestore.FieldValue.arrayUnion(name)
  });
};

// function to remove a survey from a users current page on "remove" click
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

// function that opens a particular survey on "open" click
function openSurveyPage(event) {
  const button = event.target;
  const dataValue = JSON.parse(button.getAttribute("data-value"));
  const name = dataValue[0];
  const status = dataValue[1];
  // Create the URL with query parameter
  const url = `answer-survey.html?quizId=${name}&status=${status}`;

  // Redirect to the other HTML page
  window.location.href = url;
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
