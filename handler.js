'use strict';


const api = require('lambda-api')();
const mongoose = require('mongoose');
const { MONGO_CONNECTION_STRING } = require('./config');
const UserModel = require('./models/user');


mongoose.connect(MONGO_CONNECTION_STRING);

const errorFormatter = e =>{
  let errors = {}
  //User validation failed: password: Password is required, email: Email is required, name: Name is required
  const allErrors = e.substring(e.indexOf(':') + 1).trim()
  const allErrorsInArrayFormat = allErrors.split(',').map(err => err.trim())
  allErrorsInArrayFormat.forEach(error => {
    const [key, value] = error.split(':').map(err => err.trim())
    errors[key] = value
  })

  return errors;
}

api.get('/status', async (req, res) => {
  return { status: 'Serverless application is up and running' };
});

api.post('/login', async (req, res) => {
  return { status: 'Not implemented yet' };
});

api.post('/register', async (req, res) => {
  try{
    const user = new UserModel(req.body)
    await user.save()
    delete user.password
    return {
      message:'Register success',
      data: {
        user
      }
    }
  }
  catch(e){
    console.error(e);
    return {
      message:'Something went wrong',
      case:'VALIDATION_ERROR',
      errors: errorFormatter(e.message)
    }
  }
  
});



module.exports.hello = async (event, context) => {
  return await api.run(event, context);
};
