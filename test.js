const {
    validate_email,
    validate_password,
  } = require('./validation.js');
  
  test('invalid_email', () => {
    expect(validate_email("name")).toBe(false);
    expect(validate_email("name.surname")).toBe(false);
    expect(validate_email("name@domain")).toBe(false);
    expect(validate_email("name@domain.com")).toBe(true);
  });