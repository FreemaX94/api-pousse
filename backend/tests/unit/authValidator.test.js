const Joi = require('joi');

const username = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required();

const password = Joi.string()
  .pattern(new RegExp('(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,128}'))
  .required();

const schema = Joi.object({
  username,
  password,
});

describe('✅ authValidator.js - Schéma Joi', () => {
  it('valide un username et mot de passe corrects', () => {
    const result = schema.validate({
      username: 'UserTest',
      password: 'Password1',
    });
    expect(result.error).toBeUndefined();
  });

  it('rejette un username trop court', () => {
    const result = schema.validate({
      username: 'Us',
      password: 'Password1',
    });
    expect(result.error).toBeDefined();
  });

  it('rejette un mot de passe sans chiffre', () => {
    const result = schema.validate({
      username: 'ValidUser',
      password: 'Password', // pas de chiffre
    });
    expect(result.error).toBeDefined();
  });

  it('rejette un mot de passe sans majuscule', () => {
    const result = schema.validate({
      username: 'ValidUser',
      password: 'password1',
    });
    expect(result.error).toBeDefined();
  });

  it('rejette un mot de passe trop court', () => {
    const result = schema.validate({
      username: 'ValidUser',
      password: 'Pw1',
    });
    expect(result.error).toBeDefined();
  });
});

