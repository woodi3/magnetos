const prompts = require('prompts');
const { createDirectory, copyDirectory } = require('../directory');
const { updatePackageJSON, npmInstall } = require('../utils');
const blogPrompts = require('../schematics/blog');
const Result = require('../models').Result;

/**
 * Blog project handler. Generates a new blog project.
 * @param {SingleBar} progressBar 
 * @param {boolean} debug 
 */
async function blogHandler (progressBar, debug) {
    var projectDir, projectName, projectDescription, projectDomain, includeUserManagement;
    if (debug) {
        projectDir = '../test-blog';
        projectName = 'test-blog';
        projectDescription = 'test blog description';
        projectDomain = 'testblog.com';
        includeUserManagement = true;
    } else {
        // get info about the site
        const blogPromptResponse = await prompts(blogPrompts.prompts);
        projectDir = blogPromptResponse.projectDir;
        projectName = blogPromptResponse.projectName;
        projectDescription = blogPromptResponse.projectDescription;
        projectDomain = blogPromptResponse.projectDomain;
        includeUserManagement = blogPromptResponse.includeUserManagement;
    }
    

    return new Promise(
        async function resolver (resolve, reject) {
            try {
                // create the directory
                var createDirectoryResponse = await createDirectory(projectDir);

                progressBar.start(100, 0);

                var path = createDirectoryResponse.payload.path;
                var templatePath = includeUserManagement ? './schematics/blog/templates/complex/template' : './schematics/blog/templates/basic/template';
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
                    new Result(true, 'Successfully created blog project', {
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

module.exports = blogHandler;