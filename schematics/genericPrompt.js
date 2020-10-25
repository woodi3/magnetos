const questions = [
    {
        type: 'text',
        name: 'projectDir',
        message: 'Where do you want to create this project?'
    },
    {
      type: 'text',
      name: 'projectName',
      message: 'What is the project name?'
    },
    {
      type: 'text',
      name: 'projectDescription',
      message: 'What is the project description?'
    },
    {
      type: 'text',
      name: 'projectDomain',
      message: 'What is the project domain?'
    },
    {
      type: 'confirm',
      name: 'includeUserManagement',
      message: 'Do you want to allow user registration?'
    }
];
  
  module.exports = questions;