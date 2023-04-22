const {
    validate_email,
    validate_password,
  } = require('./validation.js');
  
  test('validate_email', () => {
    expect(validate_email("name")).toBe(false);
    expect(validate_email("name.surname")).toBe(false);
    expect(validate_email("name@domain")).toBe(false);
    expect(validate_email("name@domain.com")).toBe(true);
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

  test('validate_password_length', () => {
    const password = 'pass';
    const result = validate_password(password);
    expect(result[0]).toBe(False);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(False);

    password = 'password';
    result = validate_password(password)
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(False);
  });

  test('validate_password_capitalLetter', () => {
    const password = 'password';
    const result = validate_password(password);
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(False);

    password = 'Password';
    result = validate_password(password)
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(True);
    expect(result[3]).toBe(False);
  });

  test('validate_password_capitalLetter', () => {
    const password = 'password';
    const result = validate_password(password);
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(False);

    password = 'Password';
    result = validate_password(password)
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(True);
    expect(result[3]).toBe(False);
  });

  test('validate_password_number', () => {
    const password = 'password';
    const result = validate_password(password);
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(False);

    password = 'password1';
    result = validate_password(password)
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(False);
    expect(result[3]).toBe(True);
  });

  test('validate_password_number_capitalLetter', () => {
    const password = 'Password';
    const result = validate_password(password);
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(True);
    expect(result[3]).toBe(False);

    password = 'Password1';
    result = validate_password(password)
    expect(result[0]).toBe(True);
    expect(result[1]).toBe(True);
    expect(result[2]).toBe(True);
    expect(result[3]).toBe(True);
  });