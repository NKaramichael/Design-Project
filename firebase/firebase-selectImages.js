
// import firebase from 'firebase/app';
const firebase = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyDPhBs6YrLXQspg8krTemU6WdlArx4lNQ4",
    authDomain: "pcgevaluation-49d75.firebaseapp.com",
    databaseURL: "https://pcgevaluation-49d75-default-rtdb.firebaseio.com",
    projectId: "pcgevaluation-49d75",
    storageBucket: "pcgevaluation-49d75.appspot.com",
    messagingSenderId: "369543877095",
    appId: "1:369543877095:web:84e7d5c5fdb84dd72eed42"
  };
  
// Initialise firebase
firebase.initializeApp(firebaseConfig);

let selectedImage;

// const storageRef = firebase.storage().ref().child('Level/images');
var imageList = [];

const image = {status: "unselected"};
const selectImage = (imageUrl, image) => {
  image.status = "selected";
  return image.status;
};

const greyOutImage = (image) => {
    image.style.filter = "grayscale(100%)";
    return image.style.filter;
  }  

const submitToEval = (imageList) => {
  if (imageList.length == 0){
    return ("You have not selected any images!");
  } else if (imageList.length > 3){
    return ("You have selected more than 3 images!");
  } else {
      // var dataToSend = "Hello, World!"; // The data you want to send
      var url = "../2-ResearcherPages/evaluation2.html?";
      for (let i = 0; i < imageList.length; i++){
          const imgUrl = imageList[i];

          if (i == 0){
              url += "img" + i + "=" + encodeURIComponent(imgUrl);
          } else {
              url += "&img" + i + "=" + encodeURIComponent(imgUrl);
          }
          
      }

      return url;
  }
}

module.exports = { selectImage , greyOutImage, submitToEval};