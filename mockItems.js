const firebase = require('firebase');
const firestore = require('firebase-mock');

// Create a new instance of the Firestore mock
const firestoreMock = new firestore.MockFirestore();

// Create collections in the mock database
const levelsCollection = firestoreMock.collection('Levels');
const questionsCollection = firestoreMock.collection('Questions');
const quizzesCollection = firestoreMock.collection('Quizzes');
const researchersCollection = firestoreMock.collection('Researchers');
const responsesCollection = firestoreMock.collection('Responses');
const usersCollection = firestoreMock.collection('Users');

// Example: Add a document to the 'Levels' collection
levelsCollection.doc('level1').set({
  name: 'Level 1',
  levelUrls: ['url1', 'url2', 'url3']
});

// Example: Add a document to the 'Questions' collection
questionsCollection.doc('question1').set({
  description: 'What is your favorite color?',
  type: 'Multiple Choice'
});

// Example: Add a document to the 'Quizzes' collection
quizzesCollection.doc('quiz1').set({
  name: 'Quiz 1',
  questions: ['question1', 'question2', 'question3']
});

// Example: Add a document to the 'Researchers' collection
researchersCollection.doc('researcher1').set({
  name: 'John Doe',
  researchers: ['researcher1', 'researcher2', 'researcher3']
});

// Example: Add a document to the 'Responses' collection
responsesCollection.doc('response1').set({
  answers: ['answer1', 'answer2', 'answer3']
});

// Example: Add a document to the 'Users' collection
usersCollection.doc('user1').set({
  name: 'Alice',
  completedQuizzes: ['quiz1', 'quiz2', 'quiz3']
});

// ... Continue adding documents or performing operations with the collections

// You can access the collections using the firestoreMock instance like this:
const db = firestoreMock.firestore();
const levelsRef = db.collection('Levels');
const questionsRef = db.collection('Questions');
const quizzesRef = db.collection('Quizzes');
const researchersRef = db.collection('Researchers');
const responsesRef = db.collection('Responses');
const usersRef = db.collection('Users');
