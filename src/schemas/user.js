import Joi from 'joi'

export default Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label('Email'),
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .label('Username'),
  name: Joi.string()
    .max(254)
    .required()
    .label('Name'),
  password: Joi.string()
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
    .label('Password')
    .options({
      language: {
        string: {
          regex: {
            base:
              'Must have at least one uppercase, one lowercase, one number, and one special character'
          }
        }
      }
    })
})
