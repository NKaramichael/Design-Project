let {
  selectImage, greyOutImage, submitToEval, listAll
} = require('./4-JavaScript/firebase-selectImages.js');

test('selectImage', async (done) => {
  // Mock Firebase dependencies or initialize Firebase emulator
  // to create a controlled testing environment

  expect(1).toBe(1);

  try {
    // Call your Firebase function or execute the code that interacts with Firebase
    const result = await listAll();

    expect(typeof result).toBe("object");
    // Make assertions to check the expected behavior or outcomes

    // Clean up any test-specific resources or data
  } catch (error) {
    throw error; // If there's an error, throw it to fail the test
  }
});
