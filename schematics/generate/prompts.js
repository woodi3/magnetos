const prompt = {
  type: 'select',
  name: 'projectType',
  message: 'Pick a project type',
  choices: [
    { title: 'Blog', value: 'blog' },
    { title: 'E-commerce', value: 'e-commerce'},
    { title: 'User Management', value: 'user-management' }
  ]
}

module.exports = prompt;