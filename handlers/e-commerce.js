const prompts = require('prompts');
const { createDirectory, copyDirectory } = require('../directory');
const { updatePackageJSON, npmInstall } = require('../utils');
const ecommercePrompts = require('../schematics/e-commerce');
const Result = require('../models').Result;

/**
 * E-commerce project handler. Generates a new e-commerce project.
 * @param {SingleBar} progressBar 
 * @param {boolean} debug 
 */
async function ecommerceHandler (progressBar, debug) {
    var projectDir, projectName, projectDescription, projectDomain, includeUserManagement;
    if (debug) {
        projectDir = '../test-ecommerce';
        projectName = 'test-ecommerce';
        projectDescription = 'test e-commerce description';
        projectDomain = 'testecommerce.com';
        includeUserManagement = true;
    } else {
        // get info about the site
        const ecommercePromptResponse = await prompts(ecommercePrompts.prompts);
        projectDir = ecommercePromptResponse.projectDir;
        projectName = ecommercePromptResponse.projectName;
        projectDescription = ecommercePromptResponse.projectDescription;
        projectDomain = ecommercePromptResponse.projectDomain;
        includeUserManagement = ecommercePromptResponse.includeUserManagement;
    }

    return new Promise(
        async function resolver (resolve, reject) {
            try {
                // create the directory
                var createDirectoryResponse = await createDirectory(projectDir);

                progressBar.start(100, 0);

                var path = createDirectoryResponse.payload.path;
                var templatePath = includeUserManagement ? './schematics/e-commerce/templates/complex/template' : './schematics/e-commerce/templates/basic/template';
                await copyDirectory(templatePath, path);
                
                progressBar.update(50);

                await updatePackageJSON(`${path}/package.json`, {
                    name: projectName,
                    description: projectDescription,
                    homepage: projectDomain
                });

                progressBar.update(75);

                await npmInstall(path);

                progressBar.update(100);
                
                resolve(
                    new Result(true, 'Successfully created e-commerce project', {
                        projectDir,
                        projectName,
                        projectDomain,
                        projectDescription
                    })
                );
            } catch (err) {
                reject(err);
            }
        }
    );
}

module.exports = ecommerceHandler;