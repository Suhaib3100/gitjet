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

    // Get the current branch
    const status = await git.status();
    const currentBranch = status.current;

    // Add all changes
    spinner.text = 'Adding changes...';
    await git.add('.');

    // Log status for debugging (check the staged files)
    console.log('Staged files:', status.staged);

    // Get detailed changes (modified, added, deleted files)
    const stagedFiles = status.staged;
    const modifiedFiles = stagedFiles.filter(file => file.index === 'M');
    const addedFiles = stagedFiles.filter(file => file.index === 'A');
    const deletedFiles = stagedFiles.filter(file => file.index === 'D');

    // Generate detailed commit message based on file changes
    let fileList = '';
    
    if (modifiedFiles.length) {
      fileList += `Modified: ${modifiedFiles.map(file => file.path).join(', ')}`;
    }

    if (addedFiles.length) {
      if (fileList) fileList += ', ';
      fileList += `Added: ${addedFiles.map(file => file.path).join(', ')}`;
    }

    if (deletedFiles.length) {
      if (fileList) fileList += ', ';
      fileList += `Deleted: ${deletedFiles.map(file => file.path).join(', ')}`;
    }

    fileList = fileList || 'No specific file changes detected';

    const commitMessage = message
      ? `${message} (${fileList})`
      : `Quick commit (${fileList})`;

    // Commit changes
    spinner.text = 'Committing changes...';
    await git.commit(commitMessage);

    // Check if the branch has an upstream set
    if (!status.tracking) {
      spinner.text = 'Setting upstream branch...';
      await git.push(['--set-upstream', 'origin', currentBranch]);
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
