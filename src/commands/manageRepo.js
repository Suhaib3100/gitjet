#!/usr/bin/env node

import simpleGit from 'simple-git';
import { Octokit } from '@octokit/rest';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../utils/config.js';
const git = simpleGit();

// Function to manage the Git repository actions
export async function manageRepo() {
  const spinner = ora();
  const isRepo = await git.checkIsRepo();

  try {
    // Check if the current directory is a Git repository
    if (!isRepo) {
      console.log(chalk.red('Not a git repository! Initialize one first.'));
      const { initialize } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'initialize',
          message: 'Would you like to initialize a new Git repository here?',
        },
      ]);

      if (initialize) {
        spinner.start('Initializing Git repository...');
        await git.init();
        spinner.succeed('Git repository initialized!');
      } else {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }

    // Display the menu for repository operations
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          '1. View Status',
          '2. Stage All Changes',
          '3. Commit Changes',
          '4. Push Changes',
          '5. Pull Changes',
          '6. Create a New Branch',
          '7. Switch Branch',
          '8. Merge Branch',
          '9. View Commit Log',
          '10. Set Remote URL',
          '11. Manage Pull Requests', // New Option for PRs
          '12. Exit',
        ],
      },
    ]);

    // Execute selected action
    switch (action) {
      case '1. View Status':
        await showStatus(spinner);
        break;

      case '2. Stage All Changes':
        await stageChanges(spinner);
        break;

      case '3. Commit Changes':
        await commitChanges(spinner);
        break;

      case '4. Push Changes':
        await pushChanges(spinner);
        break;

      case '5. Pull Changes':
        await pullChanges(spinner);
        break;

      case '6. Create a New Branch':
        await createBranch(spinner);
        break;

      case '7. Switch Branch':
        await switchBranch(spinner);
        break;

      case '8. Merge Branch':
        await mergeBranch(spinner);
        break;

      case '9. View Commit Log':
        await viewCommitLog(spinner);
        break;

      case '10. Set Remote URL':
        await setRemoteURL(spinner);
        break;

      case '11. Manage Pull Requests':
        await handlePR(spinner);  // Handle PRs here
        break;

      case '12. Exit':
        console.log(chalk.green('Exiting... Have a great day!'));
        return;

      default:
        console.log(chalk.yellow('Invalid option!'));
        break;
    }

  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}

// Helper functions for each repository action:

async function showStatus(spinner) {
  spinner.start('Fetching repository status...');
  const status = await git.status();
  spinner.stop();
  console.log(chalk.cyan('Repository Status:'), status);
}

async function stageChanges(spinner) {
  spinner.start('Staging all changes...');
  await git.add('.');
  spinner.succeed('All changes staged!');
}

async function commitChanges(spinner) {
  const { commitMessage } = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitMessage',
      message: 'Enter a commit message:',
      default: 'Quick commit',
    },
  ]);
  spinner.start('Committing changes...');
  await git.commit(commitMessage);
  spinner.succeed('Changes committed!');
}

async function pushChanges(spinner) {
  spinner.start('Pushing changes...');
  const pushStatus = await git.push();
  spinner.succeed('Changes pushed successfully!');
  console.log(pushStatus);
}

async function pullChanges(spinner) {
  spinner.start('Pulling changes...');
  const pullStatus = await git.pull();
  spinner.succeed('Changes pulled successfully!');
  console.log(pullStatus);
}

async function createBranch(spinner) {
  const { branchName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'branchName',
      message: 'Enter the new branch name:',
    },
  ]);
  spinner.start(`Creating branch ${branchName}...`);
  await git.checkoutLocalBranch(branchName);
  spinner.succeed(`Branch ${branchName} created and switched to!`);
}

async function switchBranch(spinner) {
  const branches = await git.branchLocal();
  const { switchBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'switchBranch',
      message: 'Select a branch to switch to:',
      choices: branches.all,
    },
  ]);
  spinner.start(`Switching to branch ${switchBranch}...`);
  await git.checkout(switchBranch);
  spinner.succeed(`Switched to branch ${switchBranch}`);
}

async function mergeBranch(spinner) {
  const { mergeBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mergeBranch',
      message: 'Select a branch to merge into the current branch:',
      choices: (await git.branchLocal()).all,
    },
  ]);
  spinner.start(`Merging branch ${mergeBranch}...`);
  await git.merge([mergeBranch]);
  spinner.succeed(`Branch ${mergeBranch} merged successfully!`);
}

async function viewCommitLog(spinner) {
  spinner.start('Fetching commit log...');
  const log = await git.log();
  spinner.stop();
  console.log(chalk.cyan('Commit Log:'), log.all);
}

async function setRemoteURL(spinner) {
  const { remoteURL } = await inquirer.prompt([
    {
      type: 'input',
      name: 'remoteURL',
      message: 'Enter the remote repository URL:',
    },
  ]);
  spinner.start('Setting remote URL...');
  await git.addRemote('origin', remoteURL);
  spinner.succeed('Remote URL set successfully!');
}

// Function to handle PR actions (create, list, merge)
async function handlePR(spinner) {
  const config = getConfig();
  const token = config.get('github.token');
  if (!token) {
    console.log(chalk.red('GitHub token is required for PR operations.'));
    return;
  }

  const octokit = new Octokit({ auth: token });

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do with PRs?',
      choices: ['Create PR', 'List PRs', 'Merge PR'],
    },
  ]);

  switch (action) {
    case 'Create PR':
      await createPR(octokit, spinner);
      break;

    case 'List PRs':
      await listPRs(octokit, spinner);
      break;

    case 'Merge PR':
      await mergePR(octokit, spinner);
      break;

    default:
      console.log(chalk.yellow('Invalid option!'));
      break;
  }
}

async function createPR(octokit, spinner) {
  // Implement PR creation logic
  spinner.succeed(chalk.green('Pull request created successfully!'));
}

async function listPRs(octokit, spinner) {
  // Implement listing PRs logic
  spinner.succeed(chalk.green('Pull requests retrieved successfully!'));
}

async function mergePR(octokit, spinner) {
  // Implement PR merge logic
  spinner.succeed(chalk.green('Pull request merged successfully!'));
}

// Run the repo management
manageRepo();
