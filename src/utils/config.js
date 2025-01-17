import Conf from 'conf';
import { getConfigPath } from './paths.js';

export function getConfig() {
  return new Conf({
    projectName: 'gitjet',
    cwd: getConfigPath(),
    defaults: {
      'github.token': null
    }
  });
}