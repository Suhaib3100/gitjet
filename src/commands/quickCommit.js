import simpleGit from 'simple-git';
import chalk from 'chalk';
import ora from 'ora';

export async function quickCommit({ message }) {
  const git = simpleGit();
  const spinner = ora('Processing quick commit...').start();

  try {
    // Check if we're in a Git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      spinner.fail(chalk.red('Not a git repository!'));
      return;
    }

    // Add all changes
    spinner.text = 'Adding changes...';
    await git.add('.');

    // Commit changes
    spinner.text = 'Committing changes...';
    const commitMessage = message || 'Quick commit via GitJet';
    await git.commit(commitMessage);

    // Check if the branch has an upstream set
    const status = await git.status();
    if (!status.tracking) {
      spinner.text = 'Setting upstream branch...';
      const branch = status.current;
      await git.push(['--set-upstream', 'origin', branch]);
    } else {
      // Push changes
      spinner.text = 'Pushing changes...';
      await git.push();
    }

    spinner.succeed(chalk.green('Changes successfully committed and pushed!'));
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}
