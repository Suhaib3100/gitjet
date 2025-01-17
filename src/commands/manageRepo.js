#!/usr/bin/env node

import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const git = simpleGit();

export async function manageRepo() {
  const spinner = ora();

  try {
    // Check if the current directory is a Git repository
    const isRepo = await git.checkIsRepo();
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

    // Display the menu only if the repository is initialized
    while (true) {
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
            '11. Exit',
          ],
        },
      ]);

      // Execute selected action
      switch (action) {
        case '1. View Status':
          spinner.start('Fetching repository status...');
          const status = await git.status();
          spinner.stop();
          console.log(chalk.cyan('Repository Status:'), status);
          break;

        case '2. Stage All Changes':
          spinner.start('Staging all changes...');
          await git.add('.');
          spinner.succeed('All changes staged!');
          break;

        case '3. Commit Changes':
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
          break;

        case '4. Push Changes':
          spinner.start('Pushing changes...');
          const pushStatus = await git.push();
          spinner.succeed('Changes pushed successfully!');
          console.log(pushStatus);
          break;

        case '5. Pull Changes':
          spinner.start('Pulling changes...');
          const pullStatus = await git.pull();
          spinner.succeed('Changes pulled successfully!');
          console.log(pullStatus);
          break;

        case '6. Create a New Branch':
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
          break;

        case '7. Switch Branch':
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
          break;

        case '8. Merge Branch':
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
          break;

        case '9. View Commit Log':
          spinner.start('Fetching commit log...');
          const log = await git.log();
          spinner.stop();
          console.log(chalk.cyan('Commit Log:'), log.all);
          break;

        case '10. Set Remote URL':
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
          break;

        case '11. Exit':
          console.log(chalk.green('Exiting... Have a great day!'));
          return;

        default:
          console.log(chalk.yellow('Invalid option!'));
          break;
      }
    }
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}

// Run the script
manageRepo();
