import React from 'react';
import { render, Box, Text } from 'ink';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figures from 'figures';
import { startJourney } from '../commands/startJourney.js';
import { quickCommit } from '../commands/quickCommit.js';
import { startRepo } from '../commands/startRepo.js';
import { handlePR } from '../commands/pullRequest.js';
import { manageRepo } from '../commands/manageRepo.js';


export async function interactiveMode() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.blue(`${figures.pointer} What would you like to do?`),
      choices: [
        {
          name: chalk.green(`${figures.star} Start Your Git Journey (Initialize Repository)`),
          value: 'Start Journey'
        },
        {
          name: chalk.yellow(`${figures.play} Quick Commit`),
          value: 'Quick Commit'
        },
        {
          name: chalk.cyan(`${figures.triangleRight} Manage Repository`),
          value: 'Manage Repository',
        },
        {
          name: chalk.magenta(`${figures.triangleUp} Manage Pull Requests`),
          value: 'Manage Pull Requests'
        },
        {
          name: chalk.blue(`${figures.arrowDown} Sync Repository`),
          value: 'Sync Repository'
        },
        {
          name: chalk.red(`${figures.cross} Exit`),
          value: 'Exit'
        }
      ],
    }
  ]);

  switch (action) {
    case 'Start Journey':
      await startJourney();
      break;
    case 'Quick Commit':
      await quickCommit({});
      break;
    case 'Initialize Repository':
      await startRepo();
      break;
    case 'Manage Repository':
        await manageRepo({});
        break;
    case 'Manage Pull Requests':
      await handlePR({});
      break;
    case 'Sync Repository':
      console.log(chalk.yellow('Sync feature coming soon!'));
      break;
    case 'Exit':
      console.log(chalk.blue('\nThanks for using GitJet! 👋\n'));
      process.exit(0);
  }
}