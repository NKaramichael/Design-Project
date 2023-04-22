let {
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
    let password = 'pass';
    let result = validate_password(password);
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(false);

    password = 'password';
    result = validate_password(password)
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(false);
  });

  test('validate_password_capitalLetter', () => {
    let password = 'password';
    let result = validate_password(password);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(false);

    password = 'Password';
    result = validate_password(password)
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(true);
    expect(result[3]).toBe(false);
  });

  test('validate_password_capitalLetter', () => {
    let password = 'password';
    let result = validate_password(password);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(false);

    password = 'Password';
    result = validate_password(password)
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(true);
    expect(result[3]).toBe(false);
  });

  test('validate_password_number', () => {
    let password = 'password';
    let result = validate_password(password);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(false);

    password = 'password1';
    result = validate_password(password)
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(false);
    expect(result[3]).toBe(true);
  });

  test('validate_password_number_capitalLetter', () => {
    let password = 'Password';
    let result = validate_password(password);
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(true);
    expect(result[3]).toBe(false);

    password = 'Password1';
    result = validate_password(password)
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(true);
    expect(result[3]).toBe(true);
  });