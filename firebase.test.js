///////////////////////////////////////////////
///////// TESTING FIREBASE FUNCTIONS /////////
///////////////////////////////////////////////

const {
  selectImage, greyOutImage
} = require('./firebase/firebase-selectImages.js');

require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

test('validate_selectImage_changesImageStatus', () => {
  const ImageUrl = "https://firebasestorage.googleapis.com/v0/b/pcgevaluation-49d75.appspot.com/o/Level%2Fimages%2Fmaze2.png?alt=media&token=0d850088-3860-4d62-90fb-25e5ac4fec53";
  const image = { status: "unselected"};
  
  const status = selectImage(ImageUrl, image);
  expect(status).toBe("selected");
});

test('validate_greyOutImage_greys_out_image', () => {
  const style = {filter: "ungrayed"};
  const image = { style: style};
  
  const newFilter = greyOutImage(image);
  expect(newFilter).toBe("grayscale(100%)");
});

///////////////////////////////////////////////
///////// TESTING ESSENTIAL FUNCTIONS /////////
///////////////////////////////////////////////

let {
  validate_email,
  validate_password,
  getEmails, 
  getPasswords,  
  changePage, 
  checkRole, 
  changeRole, 
  changePassword,
  checkSurveyID_unique,
  getData,
  change
} = require('./essentialFunctions.js');

test('validate_email_invalid_email', () => {
  expect(validate_email("name")).toBe(false);
  expect(validate_email("name.surname")).toBe(false);
  expect(validate_email("name@domain")).toBe(false);
});

test('validate_email_empty', () => {
  expect(validate_email("")).toBe(false);
});

test('validate_email_types', () => {
  const email = 'test@example.com';
  const result = validate_email(email);
  expect(typeof result).toBe('boolean');
});

test('validate_email_valid_email', () => {
  expect(validate_email("name@domain.com")).toBe(true);
});

test('validate_password_empty', () => {
  const password = '';
  const result = validate_password(password);
  expect(result[0]).toBe(false);
  expect(result[1]).toBe(false);
  expect(result[2]).toBe(false);
  expect(result[3]).toBe(false);
});

test('validate_password_types', () => {
  const password = 'password';
  const result = validate_password(password);
  expect(Array.isArray(result)).toBe(true);
  expect(typeof result[0]).toBe('boolean');
  expect(typeof result[1]).toBe('boolean');
  expect(typeof result[2]).toBe('boolean');
  expect(typeof result[3]).toBe('boolean');
  expect(result.length).toBe(4);
});

test('validate_password_length_invalid', () => {
  let password = 'pass';
  let result = validate_password(password);
  expect(result[0]).toBe(false);
});

test('validate_password_length_valid', () => {
  let password = 'password';
  let result = validate_password(password)
  expect(result[0]).toBe(true);
});

test('validate_password_hasLowercaseLetter_invalid', () => {
  let password = 'PASSWORD';
  let result = validate_password(password);
  expect(result[1]).toBe(false);
});

test('validate_password_hasLowercaseLetter_valid', () => {
  let password = 'password';
  let result = validate_password(password)
  expect(result[1]).toBe(true);
});

test('validate_password_hasCapitalLetter_invalid', () => {
  let password = 'password';
  let result = validate_password(password);
  expect(result[2]).toBe(false);
});


test('validate_returns_an_array_of_emails', () => {
  const emails = getEmails();
  expect(emails).toBeInstanceOf(Array);
  expect(emails).toContain('ex1@ex.com');
  expect(emails).toContain('ex2@ex.com');
  expect(emails).toContain('ex3@ex.com');
});

test('validate_returns_an_array_of_passwords', () => {
  const passwords = getPasswords();
  expect(passwords).toBeInstanceOf(Array);
  expect(passwords).toContain('p1');
  expect(passwords).toContain('p2');
  expect(passwords).toContain('p3');
});

test('validate_changes_the_page', () => {
  const currentPage = 'home';
  const newPage = 'about';
  expect(changePage(currentPage, newPage)).toBe(newPage);
});

test('validate_returns_true_if_user_has_admin_role', () => {
  const userRole = 'admin';
  expect(checkRole(userRole)).toBe(true);
});

test('validate_returns_false_if_user_does_not_have_researcher_role', () => {
  const userRole = 'user';
  expect(checkRole(userRole)).toBe(false);
});

test('validate_changes_the_user_role', () => {
  const currentUserRole = 'user';
  const newRole = 'admin';
  expect(changeRole(currentUserRole, newRole)).toBe(newRole);
});

test('validate_changes_the_user_password', () => {
  const currentPassword = 'password1';
  const newPassword = 'newpassword';
  expect(changePassword(currentPassword, newPassword)).toBe(newPassword);
});

test('validate_throws_an_error_if_n_is_less_than_1', () => {
  expect(() => checkSurveyID_unique(0)).toThrow('Invalid argument: n must be a positive integer');
  expect(() => checkSurveyID_unique(-1)).toThrow('Invalid argument: n must be a positive integer');
});

test('validate_returns_1_if_n_is_1_or_2', () => {
  expect(checkSurveyID_unique(1)).toBe(1);
  expect(checkSurveyID_unique(2)).toBe(1);
});

test('validate_returns_correct_large_n', () => {
  expect(checkSurveyID_unique(3)).toBe(2);
  expect(checkSurveyID_unique(4)).toBe(3);
  expect(checkSurveyID_unique(5)).toBe(5);
  expect(checkSurveyID_unique(6)).toBe(8);
  expect(checkSurveyID_unique(7)).toBe(13);
  expect(checkSurveyID_unique(8)).toBe(21);
});

test('validate_password_hasCapitalLetter_valid', () => {
  password = 'Password';
  result = validate_password(password)
  expect(result[2]).toBe(true);
});

test('validate_password_hasNumber_invalid', () => {
  let password = 'password';
  let result = validate_password(password);
  expect(result[3]).toBe(false);
});

test('validate_password_hasNumber_valid', () => {
  let password = 'password1';
  let result = validate_password(password)
  expect(result[3]).toBe(true);
});

test('validate_password_valid_input', () => {
  let password = 'Password1';
  let result = validate_password(password);
  expect(result[0]).toBe(true);
  expect(result[1]).toBe(true);
  expect(result[2]).toBe(true);
  expect(result[3]).toBe(true);
});

test('validate_getData_returns_valid_types', () => {
  let heading = 'Heading';
  let description = 'Description';
  let questions = ["ABsda3221aX@231"]; // Valid Question Reference
  let images = ['eM4J25ILgYocD2ndOhhe']; // Valid Image reference
  let data = getData(heading, description, questions, images);

  expect(typeof data.Title).toBe('string');
  expect(typeof data.Description).toBe('string');
  expect(typeof data.Status).toBe('boolean');
  expect(Array.isArray(data.Questions)).toBe(true);
  expect(Array.isArray(data.Images)).toBe(true);
});

test('validate_change_valid_input', () => {
  const result1 = change(0);
  expect(result1).toBe('A');
  const result2 = change(1);
  expect(result2).toBe('B');
  const result3 = change(2);
  expect(result3).toBe('C');
});

test('validate_change_invalid_input', () => {
  const result1 = change(3);
  expect(result1).toBe('');
  const result2 = change(-1);
  expect(result2).toBe('');
});