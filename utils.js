const fs = require('fs');
const process = require('process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const prettier = require('prettier');
const Result = require('./models').Result;

/**
 * Updates package json with provided mutations.
 * @param {string} filePath where the package.json file is located
 * @param {object} mutations list of mutations to make against the package.json file
 */
function updatePackageJSON (filePath, mutations) {
    return new Promise (
        function updatePackageJSONResolver(resolve, reject) {
            let absoluteFilePath = path.resolve(__dirname, filePath);
            fs.readFile(absoluteFilePath, function packageJSONReadFileCallback(err, data) {
                if (err) {
                    return reject(new Result(false, err.message, { err }));
                }
                let json = JSON.parse(data.toString());
                let newJson = Object.assign({}, json, mutations);
                let input = prettier.format(JSON.stringify(newJson), {parser: 'json'});
                fs.writeFileSync(absoluteFilePath, input);
                resolve(new Result(true, 'Updated package.json file.', newJson));
            });
        }
    );
}

/**
 * Runs 'npm install' in the provided directory
 * @param {string} filePath directory to run command in
 */
function npmInstall (filePath) {
    return new Promise (
        async function npmInstallResolver(resolve, reject) {
            try { 
                // Change the directory 
                process.chdir(filePath); 
                await exec('npm install');
                resolve(new Result(true, 'installed all packages'));
            } catch (err) { 
                reject(new Result(false, err.message, { err }));
            } 
        }
    )
}

module.exports = {
    updatePackageJSON,
    npmInstall
}