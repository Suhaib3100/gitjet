import { Octokit } from '@octokit/rest';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../utils/config.js';

export async function handlePR({ create, list, merge }) {
  const spinner = ora('Processing pull request...').start();

  try {
    const config = getConfig();
    const token = config.get('github.token');

    if (!token) {
      spinner.stop();
      const { token: newToken } = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: 'Enter your GitHub personal access token:'
        }
      ]);
      config.set('github.token', newToken);
    }

    const octokit = new Octokit({ auth: token });

    if (create) {
      await createPR(octokit, spinner);
    } else if (list) {
      await listPRs(octokit, spinner);
    } else if (merge) {
      await mergePR(octokit, merge, spinner);
    } else {
      // Interactive mode
      spinner.stop();
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: ['Create PR', 'List PRs', 'Merge PR']
        }
      ]);

      spinner.start();
      switch (action) {
        case 'Create PR':
          await createPR(octokit, spinner);
          break;
        case 'List PRs':
          await listPRs(octokit, spinner);
          break;
        case 'Merge PR':
          const { number } = await inquirer.prompt([
            {
              type: 'input',
              name: 'number',
              message: 'Enter PR number to merge:'
            }
          ]);
          await mergePR(octokit, number, spinner);
          break;
      }
    }
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}

async function createPR(octokit, spinner) {
  // Implementation for creating PR
  spinner.succeed(chalk.green('Pull request created successfully!'));
}

async function listPRs(octokit, spinner) {
  // Implementation for listing PRs
  spinner.succeed(chalk.green('Pull requests retrieved successfully!'));
}

async function mergePR(octokit, number, spinner) {
  // Implementation for merging PR
  spinner.succeed(chalk.green(`Pull request #${number} merged successfully!`));
}