let {
    validate_email,
    validate_password,
    getEmails, 
    getPasswords, 
    getSurveyID, 
    changePage, 
    checkRole, 
    changeRole, 
    changePassword
  } = require('./validation.js');
  
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

  test('returns an array of emails', () => {
    const emails = getEmails();
    expect(emails).toBeInstanceOf(Array);
    expect(emails).toContain('example1@example.com');
    expect(emails).toContain('example2@example.com');
    expect(emails).toContain('example3@example.com');
  });

  test('returns an array of passwords', () => {
    const passwords = getPasswords();
    expect(passwords).toBeInstanceOf(Array);
    expect(passwords).toContain('password1');
    expect(passwords).toContain('password2');
    expect(passwords).toContain('password3');
  });
  
  test('returns a survey ID', () => {
    const surveyID = getSurveyID();
    expect(typeof surveyID).toBe('string');
    expect(surveyID.length).toBeGreaterThan(0);
  });
  
  test('changes the page', () => {
    const currentPage = 'home';
    const newPage = 'about';
    expect(changePage(currentPage, newPage)).toBe(newPage);
  });
  
  test('returns true if user has admin role', () => {
    const userRole = 'admin';
    expect(checkRole(userRole)).toBe(true);
  });
  
  test('returns false if user does not have researcher role', () => {
    const userRole = 'user';
    expect(checkRole(userRole)).toBe(false);
  });
  
  test('changes the user role', () => {
    const currentUserRole = 'user';
    const newRole = 'admin';
    expect(changeRole(currentUserRole, newRole)).toBe(newRole);
  });
  
  test('changes the user password', () => {
    const currentPassword = 'password1';
    const newPassword = 'newpassword';
    expect(changePassword(currentPassword, newPassword)).toBe(newPassword);
  });
  