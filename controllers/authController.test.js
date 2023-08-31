/* eslint-disable no-undef */
const axios = require('axios');
/*
1. Given email and password, return status 400 if empty and 200 if correct
2. Return "Email or password is wrong" with status 401 if email did not find
3. Return "Email or password is wrong" with status 401 if password was wrong 
4. Return token must be a string
5. Return name or password required with status 400 if they didn't set
6. Return name must be string if name is not string
7. Return a two fields in response email and subsription
*/

const emptyLoginData = {};

const correctLoginData = {
  email: 'asasassssnasulla.ante@vestibul.co.uk',
  password: '123456',
};

const incorrecPasswordtLoginData = {
  email: 'asassssnasulla.ante@vestibul.co.uk',
  password: '1234567',
};

const incorrectEmailLoginData = {
  email: 'asassssnasulla.ante@vestibul.co.uk',
  password: '1234567',
};

const notFullData = {
  password: '1234567',
};

const typeNumberLoginData = {
  email: 1,
  password: '1234567',
};

describe('Test login controller', () => {
  it('should respond with status code 401', async () => {
    try {
      await axios.post('http://localhost:3000/users/login', emptyLoginData);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain(
        'Помилка від Joi або іншої бібліотеки валідації',
      );
    }
  });
  it('should respond with status code 200', async () => {
    const response = await axios.post('http://localhost:3000/users/login', correctLoginData);

    expect(response.status).toBe(200);
  });
  it('should respond with status code 401 if email is wrong', async () => {
    try {
      await axios.post('http://localhost:3000/users/login', incorrectEmailLoginData);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toContain('Email or password is wrong');
    }
  });
  it('should respond with status code 401 if password is wrong', async () => {
    try {
      await axios.post('http://localhost:3000/users/login', incorrecPasswordtLoginData);
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toContain('Email or password is wrong');
    }
  });
  it('should respond with a valid token', async () => {
    const response = await axios.post('http://localhost:3000/users/login', correctLoginData);

    expect(typeof response.data.token).toBe('string');
  });
  it('should be name or password in request data with status 401 and message (Помилка від Joi або іншої бібліотеки валідації)', async () => {
    try {
      await axios.post('http://localhost:3000/users/login', notFullData);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain(
        'Помилка від Joi або іншої бібліотеки валідації',
      );
    }
  });
  it('name must be a string, response with status 401 and message (Помилка від Joi або іншої бібліотеки валідації) ', async () => {
    try {
      await axios.post('http://localhost:3000/users/login', typeNumberLoginData);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain(
        'Помилка від Joi або іншої бібліотеки валідації',
      );
    }
  });
  it('should be a two fields in response email and subsription', async () => {
    const response = await axios.post('http://localhost:3000/users/login', correctLoginData);

    expect(response.data.user).toEqual(expect.any(Object));
    expect(typeof response.data.user.email).toBe('string');
    expect(typeof response.data.user.subscription).toBe('string');
  });
});
