import { celebrate, Joi, Segments } from 'celebrate'

// Politique de username : chaîne alphanumérique, 3–30 caractères
const username = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required()
  .messages({
    'string.base': `"username" doit être une chaîne`,
    'string.empty': `"username" ne peut pas être vide`,
    'string.alphanum': `"username" ne peut contenir que des caractères alphanumériques`,
    'string.min': `"username" doit contenir au moins {#limit} caractères`,
    'string.max': `"username" doit contenir au plus {#limit} caractères`,
    'any.required': `"username" est requis`,
  })

// Politique de password : chaîne, 8–128 caractères, au moins 1 chiffre et 1 lettre majuscule
const password = Joi.string()
  .pattern(new RegExp('(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,128}'))
  .required()
  .messages({
    'string.pattern.base': `"password" doit contenir entre 8 et 128 caractères, dont au moins une majuscule et un chiffre`,
    'string.empty': `"password" ne peut pas être vide`,
    'any.required': `"password" est requis`,
  })

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object({
    username,
    password,
  })
})

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object({
    username,
    password,
  })
})
