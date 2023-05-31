import { displayCurrentQuizzes, displayQuizzes } from './firebase/firebase-bucket.js';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Mock the displayQuizzes function
jest.mock('./firebase/firebase-bucket.js', () => ({
  displayQuizzes: jest.fn()
}));

describe('displayCurrentQuizzes', () => {
  it('should call displayQuizzes with "current" argument', () => {
    // Call the function to be tested
    displayCurrentQuizzes();

    // Assert that displayQuizzes was called with the expected argument
    expect(displayQuizzes).toHaveBeenCalledWith('current');
  });
});