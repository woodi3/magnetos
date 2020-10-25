const prompts = require('prompts');

const Result = require('./models').Result;
const blogHandler = require('./handlers/blog');
const ecommerceHandler = require('./handlers/e-commerce');
const userManagementHandler = require('./handlers/user-management');
const projectTypePrompt = require('./schematics/generate');


const ACCEPTABLE_ENTITIES = [
    'blog',
    'e-commerce',
    'user-management'
];

function isAcceptable (entity) {
    return ACCEPTABLE_ENTITIES.indexOf(entity) > -1;
}

async function parse (entity, progressBar, debug = false) {
    switch (entity) {
        case 'blog':
            return blogHandler(progressBar, debug);
        case 'e-commerce':
            return ecommerceHandler(progressBar, debug);
        case 'user-management':
            return userManagementHandler(progressBar, debug);
        default:
            break;
    }
    return new Result(false, `'parse' method could not find the entity you want to generate.`);
}

async function handler ({ entity, blog, ecommerce, userManagement, debug }, progressBar) {
    let projectType = entity;

    // if supplied project type isn't acceptable, show selection for types
    if (debug) {
        if (blog) {
            projectType = 'blog';
        }
        if (ecommerce) {
            projectType = 'e-commerce';
        }
        if (userManagement) {
            projectType = 'user-management';
        }
        
    } else if (!isAcceptable(projectType)) {
        const response = await prompts(projectTypePrompt.prompts);
        projectType = response.projectType;
    }
    
    return parse(projectType, progressBar, debug);
}

module.exports = handler;