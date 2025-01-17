import { platform } from 'os';
import { join, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function getConfigPath() {
  const isWindows = platform() === 'win32';
  const configDir = isWindows ? process.env.APPDATA : join(process.env.HOME, '.config');
  return join(configDir, 'gitjet');
}

export function normalizePath(path) {
  return normalize(path).replace(/[\\/]+/g, '/');
}

export function getProjectRoot() {
  return normalize(join(__dirname, '..', '..'));
}