import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

export async function startRepo() {
  const git = simpleGit();
  const spinner = ora('Setting up repository...').start();

  try {
    // Check if already a git repository
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      spinner.info(chalk.yellow('Repository already initialized!'));
      return;
    }

    // Initialize repository
    spinner.text = 'Initializing repository...';
    await git.init();

    // Prompt for remote setup
    spinner.stop();
    const { setupRemote } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupRemote',
        message: 'Would you like to set up a remote repository?',
        default: true
      }
    ]);

    if (setupRemote) {
      const { remoteUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'remoteUrl',
          message: 'Enter the remote repository URL:'
        }
      ]);

      spinner.start('Setting up remote...');
      await git.addRemote('origin', remoteUrl);
    }

    spinner.succeed(chalk.green('Repository successfully initialized!'));
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}
// Some things