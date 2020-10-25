#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const cliProgress = require('cli-progress');
const generateHandler = require('./generate');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

yargs(hideBin(process.argv))
  .command(['generate [entity]', 'g'], 'generate new project', (yargs) => {
    yargs
      .positional('entity', {
        describe: 'project type to generate',
        default: null
      })
  }, function (argv) {
      generateHandler(argv, progressBar)
        .then(function (result) {
            progressBar.stop();
            console.log(result);
        })
        .catch(function (error) {
            console.error('Some how an error was thrown!');
            console.error(error);
        });
  })
  .option('debug', {
      alias: 'd',
      type: 'boolean',
      description: 'Run using debug props'
  })
  .option('blog', {
      alias: 'b',
      type: 'boolean',
      description: 'Run debug using blog project'
  })
  .option('ecommerce', {
    alias: 'e',
    type: 'boolean',
    description: 'Run debug using ecommerce project'
  })
  .option('userManagement', {
    alias: 'u',
    type: 'boolean',
    description: 'Run debug using user management project'
  })
  .argv