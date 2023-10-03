// Get a reference to the Firebase Storage service
var storage = firebase.storage();

// Get a reference to the Firebase Firestore database
var firestore = firebase.firestore();

// THESE FUNCTIONS ARE FOR UPLOADING IMAGES TO THE DATABASE
async function uploadImages(files, imageArr) {
    // Upload images to Firebase Storage and Firestore
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgDetails = imageArr[i];
        const dom = imgDetails.get('domain');
        const mod = imgDetails.get('model');

        await uploadImage(file, dom, mod, i);
    }
}

async function uploadImage(file, domain, model, imageNum) {
    try {
        var storageRef = storage.ref().child('Level/images/' + file.name);

        // Create the metadata object with custom metadata fields
        var metadata = {
            customMetadata: {
                domain: domain,
                model: model
            }
        };

        // Upload the image file to Firebase Storage with metadata
        await storageRef.put(file, metadata);
        console.log('Image uploaded successfully!');

        // Get the download URL of the uploaded image
        var url = await storageRef.getDownloadURL();
        console.log('Image URL:', url);

        // Save the image URL and metadata in Cloud Firestore
        var docRef = await firestore.collection('Levels').add({
            imageUrl: url,
            domain: domain,
            model: model
        });
        const ref = 'ref' + imageNum;
        sessionStorage.setItem(ref, docRef.id);
        console.log('Image URL and metadata saved in Firestore! Ref:', docRef.id);
    } catch (error) {
        console.log('Error uploading image:', error);
    }
}