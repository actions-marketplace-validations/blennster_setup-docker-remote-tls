import * as core from '@actions/core';

export interface Options {
  readonly tlsKey: string;
  readonly tlsCa: string;
  readonly tlsCert: string;
  readonly tcpHost: string;
}

const findOption: (inputKey: string, envKey: string) => string | null = (
  inputKey,
  envKey
) => {
  const input = core.getInput(inputKey);

  if (input.length === 0) {
    return process.env[envKey] ?? null;
  } else {
    return input;
  }
};

const requireOption: (inputKey: string, envKey: string) => string = (
  inputKey,
  envKey
) => {
  const result = findOption(inputKey, envKey);
  if (!result) {
    core.setFailed(
      `input ${inputKey} (or env ${envKey}) is required but was missing`
    );
    process.exit(1);
  }
  return result!;
};

const getOptions: () => Options = () => ({
  tlsKey: requireOption('tls_key', 'SDR_TLS_KEY')!,
  tlsCa: requireOption('tls_ca', 'SDR_TLS_CA')!,
  tlsCert: requireOption('tls_cert', 'SDR_TLS_CERT')!,
  tcpHost: requireOption('tcp_host', 'SDR_TCP_HOST'),
});

export const validateOptions: (options: Options) => boolean = (o) => {
  let result = true;

  if ([Object.values(o)].some((v) => v.length === 0)) {
    core.setFailed(`Keys or host cannot be empyty`);
    result = false;
  }

  return result;
};

export default getOptions;
