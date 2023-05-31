let {
    displayCurrentQuizzes, displayQuizzes
  } = require('./firebase/firebase-bucket.js');

  require('firebase/auth');
  require('firebase/firestore');
  require('firebase/storage');

// Mock the displayQuizzes function
  jest.mock('./firebase/firebase-bucket.js', () => ({
    displayQuizzes: jest.fn()
  }));

  describe('displayCurrentQuizzes', () => {
    it('should call displayQuizzes with "current" argument', () => {
      // Call the function to be tested
      displayCurrentQuizzes('current');
  
      // Assert that displayQuizzes was called with the expected argument
      expect(displayQuizzes).toHaveBeenCalledWith('current');
    });
  });