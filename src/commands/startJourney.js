import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import boxen from 'boxen';

export async function startJourney() {
  // Display welcome message
  console.log(
    boxen(
      chalk.bold.blue(
        `Welcome to GitJet! 🚀\n\n` +
        chalk.dim('Created with ❤️ by Suhaib\n') +
        chalk.dim('Let\'s start your amazing Git journey!')
      ),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue',
        float: 'center'
      }
    )
  );

  const git = simpleGit();
  const spinner = ora('Starting your Git journey...').start();

  try {
    // Check if already a git repository
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      spinner.info(chalk.yellow('Repository already initialized!'));
      return;
    }

    // Advanced: Ask for Git configuration
    spinner.stop();
    const { configureGit } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'configureGit',
        message: chalk.blue(`${figures.pointer} Would you like to configure your Git identity?`),
        default: true
      }
    ]);

    if (configureGit) {
      const { name, email } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: chalk.blue(`${figures.pointer} Enter your name:`),
          validate: input => input.length > 0 || 'Name is required'
        },
        {
          type: 'input',
          name: 'email',
          message: chalk.blue(`${figures.pointer} Enter your email:`),
          validate: input => input.includes('@') || 'Please enter a valid email'
        }
      ]);

      spinner.start('Configuring Git...');
      await git.addConfig('user.name', name);
      await git.addConfig('user.email', email);
      spinner.succeed(chalk.green(`${figures.tick} Git configuration complete!`));
    }

    spinner.start('Initializing your first repository...');
    await git.init();
    spinner.succeed(chalk.green(`${figures.tick} Repository initialized successfully!`));

    // Advanced: Branch setup
    spinner.stop();
    const { defaultBranch } = await inquirer.prompt([
      {
        type: 'list',
        name: 'defaultBranch',
        message: chalk.blue(`${figures.pointer} Choose your default branch name:`),
        choices: [
          { name: 'main (recommended)', value: 'main' },
          { name: 'master (legacy)', value: 'master' }
        ],
        default: 'main'
      }
    ]);

    if (defaultBranch === 'main') {
      spinner.start('Setting up main branch...');
      await git.raw(['branch', '-M', 'main']);
      spinner.succeed(chalk.green(`${figures.tick} Branch renamed to main`));
    }

    // Get remote URL
    spinner.stop();
    const { remoteUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'remoteUrl',
        message: chalk.blue(`${figures.pointer} Enter your GitHub repository URL:`),
        validate: (input) => {
          if (!input) return 'Please enter a valid URL';
          if (!input.includes('github.com')) return 'Please enter a valid GitHub URL';
          return true;
        }
      }
    ]);

    // Add remote
    spinner.start('Setting up remote connection...');
    await git.addRemote('origin', remoteUrl);
    spinner.succeed(chalk.green(`${figures.tick} Remote repository connected!`));

    // Advanced: .gitignore setup
    spinner.stop();
    const { setupGitignore } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupGitignore',
        message: chalk.blue(`${figures.pointer} Would you like to set up a .gitignore file?`),
        default: true
      }
    ]);

    if (setupGitignore) {
      const { gitignoreType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'gitignoreType',
          message: chalk.blue(`${figures.pointer} Choose your project type:`),
          choices: [
            'Node',
            'Python',
            'Java',
            'React',
            'Vue',
            'Basic'
          ]
        }
      ]);

      spinner.start('Setting up .gitignore...');
      // Add basic .gitignore content based on project type
      const gitignoreContent = getGitignoreContent(gitignoreType);
      await fs.promises.writeFile('.gitignore', gitignoreContent);
      spinner.succeed(chalk.green(`${figures.tick} .gitignore file created!`));
    }

    // Ask about files
    spinner.stop();
    const { fileSelection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileSelection',
        message: chalk.blue(`${figures.pointer} How would you like to add files?`),
        choices: [
          { name: 'Add all files', value: 'all' },
          { name: 'Select specific files', value: 'select' },
          { name: 'Advanced selection (with patterns)', value: 'advanced' }
        ]
      }
    ]);

    if (fileSelection === 'select') {
      const status = await git.status();
      const { files } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'files',
          message: chalk.blue(`${figures.pointer} Select files to commit:`),
          choices: status.not_added.map(file => ({
            name: file,
            value: file
          }))
        }
      ]);
      
      spinner.start('Adding selected files...');
      for (const file of files) {
        await git.add(file);
      }
    } else if (fileSelection === 'advanced') {
      const { pattern } = await inquirer.prompt([
        {
          type: 'input',
          name: 'pattern',
          message: chalk.blue(`${figures.pointer} Enter file pattern (e.g., "src/*.js", "*.txt"):`),
          default: '*.*'
        }
      ]);
      spinner.start('Adding files by pattern...');
      await git.add(pattern);
    } else {
      spinner.start('Adding all files...');
      await git.add('.');
    }
    spinner.succeed(chalk.green(`${figures.tick} Files added successfully!`));

    // Get commit message
    spinner.stop();
    const { useCustomMessage } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useCustomMessage',
        message: chalk.blue(`${figures.pointer} Would you like to add a custom commit message?`),
        default: false
      }
    ]);

    let commitMessage = 'First commit by GitJet 🚀';
    if (useCustomMessage) {
      const { messageType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'messageType',
          message: chalk.blue(`${figures.pointer} Choose commit message type:`),
          choices: [
            { name: 'Simple message', value: 'simple' },
            { name: 'Conventional commit', value: 'conventional' }
          ]
        }
      ]);

      if (messageType === 'conventional') {
        const { type, scope, description } = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Select commit type:',
            choices: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
          },
          {
            type: 'input',
            name: 'scope',
            message: 'Enter scope (optional):',
          },
          {
            type: 'input',
            name: 'description',
            message: 'Enter commit description:',
            validate: input => input.length > 0 || 'Description is required'
          }
        ]);
        commitMessage = `${type}${scope ? `(${scope})` : ''}: ${description}`;
      } else {
        const { message } = await inquirer.prompt([
          {
            type: 'input',
            name: 'message',
            message: chalk.blue(`${figures.pointer} Enter your commit message:`),
            default: commitMessage
          }
        ]);
        commitMessage = message;
      }
    }

    // Commit and push
    spinner.start('Creating your first commit...');
    await git.commit(commitMessage);
    spinner.succeed(chalk.green(`${figures.tick} Changes committed successfully!`));

    spinner.start('Pushing to GitHub...');
    await git.push('origin', defaultBranch);
    spinner.succeed(chalk.green(`${figures.tick} Everything is now on GitHub! 🎉`));

    // Display success message with credits
    console.log(
      boxen(
        chalk.bold.green(
          '🎊 Congratulations on your first Git repository! 🎊\n\n' +
          chalk.blue('GitJet - Making Git Simple and Beautiful\n') +
          chalk.dim('Created with passion by Suhaib\n') +
          chalk.dim('Star us on GitHub: github.com/suhaib/gitjet')
        ),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
          float: 'center'
        }
      )
    );
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}

function getGitignoreContent(type) {
  const baseIgnores = [
    '.DS_Store',
    '.env',
    '.env.local',
    '.env.*.local',
    'node_modules/',
    'dist/',
    'build/',
    '*.log'
  ];

  const typeSpecificIgnores = {
    Node: [
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'coverage/',
      '.npm'
    ],
    Python: [
      '__pycache__/',
      '*.py[cod]',
      '*$py.class',
      'venv/',
      '.env/',
      '*.so'
    ],
    Java: [
      '*.class',
      '*.jar',
      'target/',
      '.idea/',
      '*.iml'
    ],
    React: [
      '.cache/',
      'public/dist/',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local'
    ],
    Vue: [
      '.nuxt',
      'dist/',
      '.cache/',
      '.output/'
    ],
    Basic: []
  };

  return [...baseIgnores, ...(typeSpecificIgnores[type] || [])].join('\n');
}