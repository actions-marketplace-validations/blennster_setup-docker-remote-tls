import * as core from '@actions/core';
import * as exec from '@actions/exec';
import os from 'os';
import fs from 'fs';

import getOptions, { Options, validateOptions } from './options';

const main = async () => {
  // retrieve the options
  const options: Options = getOptions();

  if (!validateOptions(options)) {
    process.exit(1);
  }

  const dockerDir = os.homedir() + '/.docker';

  // ensure clear ssh setup
  await exec.exec('rm', ['-rf', dockerDir]);
  await exec.exec('mkdir', ['-pv', dockerDir]);

  // write necessary files & set modes
  fs.writeFileSync(`${dockerDir}/key.pem`, options.tlsKey);
  await exec.exec('chmod', ['400', `${dockerDir}/key.pem`]);

  fs.writeFileSync(`${dockerDir}/ca.pem`, options.tlsCa);
  await exec.exec('chmod', ['400', `${dockerDir}/ca.pem`]);

  fs.writeFileSync(`${dockerDir}/cert.pem`, options.tlsCert);
  await exec.exec('chmod', ['400', `${dockerDir}/cert.pem`]);

  // setup remote docker environment
  core.exportVariable('DOCKER_HOST', `tcp://${options.tcpHost}`);
  core.exportVariable('DOCKER_TLS_VERIFY', 1);
};

try {
  main();
} catch (error) {
  core.setFailed(`${error}`);
}
