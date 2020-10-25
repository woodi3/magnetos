const prompts = require('prompts');
const { createDirectory, copyDirectory } = require('../directory');
const { updatePackageJSON, npmInstall } = require('../utils');
const userManagementPrompts = require('../schematics/user-management');
const Result = require('../models').Result;

/**
 * User management project handler. Generates a new user management project.
 * @param {SingleBar} progressBar provided progress bar 
 * @param {boolean} debug use debug values
 */
async function userManagementHandler (progressBar, debug) {
    var projectDir, projectName, projectDescription, projectDomain, includeUserManagement;
    if (debug) {
        projectDir = '../test-user-management';
        projectName = 'test-user-management';
        projectDescription = 'test e-commerce description';
        projectDomain = 'testusermanagement.com';
        includeUserManagement = true;
    } else {
        // get info about the site
        const userManagementPromptResponse = await prompts(userManagementPrompts.prompts);
        projectDir = userManagementPromptResponse.projectDir;
        projectName = userManagementPromptResponse.projectName;
        projectDescription = userManagementPromptResponse.projectDescription;
        projectDomain = userManagementPromptResponse.projectDomain;
        includeUserManagement = userManagementPromptResponse.includeUserManagement;
    }
    
    return new Promise(
        async function resolver (resolve, reject) {
            try {
                // create the directory
                var createDirectoryResponse = await createDirectory(projectDir);

                progressBar.start(100, 0);

                var path = createDirectoryResponse.payload.path;
                var templatePath = includeUserManagement ? './schematics/user-management/templates/complex/template' : './schematics/user-management/templates/basic/template';
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
                    new Result(true, 'Successfully created user-management project', {
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

module.exports = userManagementHandler;