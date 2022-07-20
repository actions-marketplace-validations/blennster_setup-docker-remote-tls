import * as core from '@actions/core';
import * as exec from '@actions/exec';
import os from 'os';

const main = async () => {
  // reset docker host
  core.exportVariable('DOCKER_HOST', null);

  // reset verify tls
  core.exportVariable('DOCKER_VERIFY_TLS', null);

  // reset ssh
  await exec.exec('rm', ['-rf', os.homedir() + '/.docker/{ca,key,cert}.pem']);
};

try {
  main();
} catch (error) {
  core.setFailed(`${error}`);
}
