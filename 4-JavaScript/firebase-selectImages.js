const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

// const { JSDOM } = require('jsdom');
// const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// global.document = dom.window.document;

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

const storageRef = firebase.storage().ref().child('Level/images');
var imageList = [];
await listAll();

async function listAll(){
  storageRef.listAll()
    .then(function(result) {
      result.items.forEach(function(imageRef) {
        // Create an img element for each image
        // const img = document.createElement('img');
        // img.width = 100;
        // img.height = 100;

        // Get the download URL for the image
        imageRef.getDownloadURL().then(function(url) {
          // img.src = url;

          // Add an event listener to capture the user's selection
          // img.addEventListener('click', function() {
          //   selectImage(img.src, img);
          // });

          // Append the img element to the page
          // document.getElementById("imageSpace").appendChild(img);
        }).catch(function(error) {
          console.log(error);
        });
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}


// const form = document.getElementById('ImageForm');
// const selectedImageInput = document.createElement('input');
// selectedImageInput.type = 'hidden';
// selectedImageInput.name = 'selected-image';
// form.appendChild(selectedImageInput);

function selectImage(imageUrl, image) {
  // selectedImage = imageUrl;
  // selectedImageInput.value = imageUrl;
  
  // if (imageList.length < 3){
  //   imageList.push(imageUrl);
  //   greyOutImage(image);
  // } else {
  //   alert("3 images already selected!");
  // }

}

function greyOutImage(image) {
    // image.style.filter = "grayscale(100%)";
  }  

function submitToEval(){
    // if (imageList.length == 0){
    //     alert("You have not selected any images!");
    // } else {
    //     // var dataToSend = "Hello, World!"; // The data you want to send
    //     var url = "../2-ResearcherPages/evaluation2.html?";
    //     for (let i = 0; i < imageList.length; i++){
    //         const imgUrl = imageList[i];

    //         if (i == 0){
    //             url += "img" + i + "=" + encodeURIComponent(imgUrl);
    //         } else {
    //             url += "&img" + i + "=" + encodeURIComponent(imgUrl);
    //         }
            
    //     }

    //     window.location.href = url;
    // }
}

module.exports = {selectImage, greyOutImage, submitToEval};