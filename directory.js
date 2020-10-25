const prompts = require('prompts');
const prettier = require('prettier');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const Result = require('./models').Result;
const directoryOverwritePrompt = require('./schematics/directory');

function createDirectory (dirPath) {
    return new Promise (
        async function createDirResolver (resolve, reject) {
            var result = new Result(true, 'Successfully created directory', {
                path: dirPath
            });
            try {
                _createDirectory(dirPath);
            } catch (err) {
                if (err.code != 'EEXIST') {
                    // we have an error
                    result.update(false, err.message, {err});
                    return reject(result);
                }
                // directory already exists
                const { overwriteDir } = await prompts(directoryOverwritePrompt.prompts);
                if (overwriteDir) {
                    try {
                        _createDirectory(dirPath, true);
                    } catch (nextErr) {
                        result.update(false, nextErr.message, {err: nextErr});
                        return reject(result);
                    }
                } else {
                    result.update(false, `[User Action]: Declined to overwrite existing directory: ${dirPath}`);
                    return reject(result);
                }
            }
            resolve(result);
        }
    );
}
function copyDirectory (src, dest) {
    return new Promise (
        function copyDirectoryResolver (resolve, reject) {
            _copyDir(src, dest)
                .then(resolve)
                .catch(reject)
        }
    );
};

function _copyDir (src, dest, isInit = true) {
    return new Promise (
        async function _copyDirResolver (resolve, reject) {
            try {
                if (!isInit) {
                    _createDirectory(dest, true);
                }
                var files = fs.readdirSync(src);
                for (let i = 0; i < files.length; i++) {
                    var current = fs.lstatSync(path.join(src, files[i]));
                    if (current.isDirectory()) {
                        _copyDir(path.join(src, files[i]), path.join(dest, files[i]), false);
                    } else if (current.isSymbolicLink()) {
                        var symlink = fs.readlinkSync(path.join(src, files[i]));
                        fs.symlinkSync(symlink, path.join(dest, files[i]));
                    } else {
                        const _copyResponse = await _copy(
                            path.join(src, files[i]), path.join(dest, files[i])
                        );
                        if (!_copyResponse.success) {
                            return reject(_copyResponse);
                        }
                    }
                }
                return resolve(new Result(true, 'Successfully copied directory'));
            } catch (err) {
                return reject(new Result(false, err.message, { err }));
            }
        }
    );
}

function _copy(src, dest) {
    return new Promise(
        function _copyResolver (resolve, reject) {
            try {
                var oldFile = fs.createReadStream(src);
                var newFile = fs.createWriteStream(dest);
                oldFile.pipe(newFile);
                return resolve(new Result(true));
            } catch (err) {
                return resolve(new Result(false, err.message, { err }));
            }
        }
    );
};
function createFile (path, content, contentOpts, prettierOpts = {parser: 'babel'}) {
    let output = ejs.render(content, contentOpts);
    output = prettier.format(output, prettierOpts);
    return new Promise (function resolver (resolve, reject) {
        fs.appendFile(path, output, function (err) {
            if (err) {
                return reject(
                    new Result(
                        false,
                        err.message,
                        err
                    )
                );
            }
            return resolve(
                new Result(true, `Successfully created file at ${path}`)
            );
        });
    });
}
function _createDirectory (path, overwrite) {
    if (overwrite) {
        _deleteDirectory(path);
    }
    fs.mkdirSync(path);
}
function _deleteDirectory (path) {
    fs.rmdirSync(path, { recursive: true });
}

module.exports = {
    createDirectory,
    copyDirectory,
    createFile
}