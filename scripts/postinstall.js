#!/usr/bin/env node

import { spawn } from 'cross-spawn';
import { chmod } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';
import which from 'which';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function makeExecutable(filePath) {
  try {
    await chmod(filePath, '755');
  } catch (error) {
    // Ignore chmod errors on Windows
    if (platform() !== 'win32') {
      console.error('Warning: Could not make file executable:', error.message);
    }
  }
}

async function checkGitInstallation() {
  try {
    await which('git');
    return true;
  } catch (error) {
    console.error('\x1b[31mError: Git is not installed on your system.\x1b[0m');
    console.log('\nPlease install Git from: https://git-scm.com/downloads');
    return false;
  }
}

async function checkGitConfig() {
  const gitUser = spawn.sync('git', ['config', '--global', 'user.name'], { encoding: 'utf8' });
  const gitEmail = spawn.sync('git', ['config', '--global', 'user.email'], { encoding: 'utf8' });

  if (!gitUser.stdout.trim() || !gitEmail.stdout.trim()) {
    console.log('\x1b[33mWarning: Git user configuration not found.\x1b[0m');
    console.log('You can set it up using:');
    console.log('  git config --global user.name "Your Name"');
    console.log('  git config --global user.email "your.email@example.com"');
  }
}

async function postInstall() {
  console.log('\x1b[34m\nSetting up GitJet...\x1b[0m');

  // Make index.js executable
  const indexPath = join(__dirname, '..', 'src', 'index.js');
  await makeExecutable(indexPath);

  // Check Git installation
  const hasGit = await checkGitInstallation();
  if (!hasGit) {
    process.exit(1);
  }

  // Check Git configuration
  await checkGitConfig();

  console.log('\x1b[32m\nGitJet setup complete! 🚀\x1b[0m');
  console.log('\nYou can now use GitJet by running:');
  console.log('  gitjet\n');
}

postInstall().catch(error => {
  console.error('\x1b[31mError during GitJet setup:\x1b[0m', error);
  process.exit(1);
});