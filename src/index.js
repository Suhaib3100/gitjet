#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import figures from 'figures';
import { quickCommit } from './commands/quickCommit.js';
import { startRepo } from './commands/startRepo.js';
import { handlePR } from './commands/pullRequest.js';
import { startJourney } from './commands/startJourney.js';
import { interactiveMode } from './interactive/index.js';

// Display GitJet banner with credits
console.log(
  boxen(
    chalk.bold.blue(
      `${figures.star} GitJet CLI ${figures.star}\n\n` +
      chalk.dim('Simplifying Git workflows with style!\n\n') +
      chalk.cyan('Created with ❤️ by Suhaib')
    ),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'blue',
      float: 'center'
    }
  )
);

program
  .name('gitjet')
  .description('A modern CLI tool for simplified Git and GitHub workflows')
  .version('1.0.0', '-v, --version', 'Display GitJet version')
  .addHelpText('after', `\n  ${chalk.cyan('Created with ❤️ by Suhaib')}`);

// Start Journey command for beginners
program
  .command('journey')
  .description(chalk.blue('Start your Git journey (perfect for beginners!)'))
  .action(startJourney);

// Quick commit command
program
  .command('quickcommit')
  .description('Add, commit, and push changes in one command')
  .option('-m, --message <message>', 'Commit message')
  .action(quickCommit);

// Start repository command
program
  .command('start')
  .description('Initialize and set up a new repository')
  .action(startRepo);

// Pull request command
program
  .command('pr')
  .description('Manage pull requests')
  .option('-c, --create', 'Create a new pull request')
  .option('-l, --list', 'List pull requests')
  .option('-m, --merge <number>', 'Merge a pull request')
  .action(handlePR);

// Default command (interactive mode)
program
  .action(() => {
    interactiveMode();
  });

program.parse();