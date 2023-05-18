// This file is used to recreate the quizzes on the users end
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

function navPanel() {
  // Get Question from survey reference and store them in array

  const questions = [
    { id: 1, text: 'Question 1', content: 'Content for question 1' },
    { id: 2, text: 'Question 2', content: 'Content for question 2' },
    { id: 3, text: 'Question 3', content: 'Content for question 3' },
  ];

  // initialise firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // single question form - dDg8vThQnn9a1C7tDPjp
  // multiple question form - Sa65UvWT94W0eCFHjoWs
  testQuiz = 'Sa65UvWT94W0eCFHjoWs'

  Ref = db.collection("Quizzes").doc(testQuiz);
  refToCollect = db.collection("Questions")

  Ref.get().then((doc) => {
    const docData = doc.data();
    const questionRefs = docData.Questions;
    const promises = questionRefs.map(questionRef =>
      refToCollect.doc(questionRef).get().then((questionDoc) => {
        const questionData = questionDoc.data();
        const questionText = questionData.Description;
        const size = questions.length;
        const list = { id: size + 1, text: 'Question ' + (size + 1), content: questionText };
        questions.push(list);
        console.log(questionText);
      }).catch((error) => {
        console.log("Error fetching question document:", error);
      })
    );

    Promise.all(promises).then(() => {
      console.log(questions); // Verify the populated questions array

      const navPanel = document.getElementById('nav-panel');
      const container = document.getElementById('container');

      questions.forEach(question => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.questionId = question.id;
        a.textContent = question.text;
        li.appendChild(a);
        navPanel.appendChild(li);
      });

      navPanel.addEventListener('click', event => {
        if (event.target.matches('[data-question-id]')) {
          event.preventDefault();
          const questionId = event.target.dataset.questionId;
          const question = questions.find(q => q.id === parseInt(questionId));
          container.innerHTML = question.content;
        }
      });
    });
  });

}