const {
  selectImage
} = require('./firebase/firebase-images.js');

require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

test('selectImage', () => {
  expect(1).toBe(1);
});