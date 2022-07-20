# Setup TLS & DOCKER_HOST in a GitHub Action

Based on [secure by default](https://docs.docker.com/engine/security/protect-access/#secure-by-default).

A small wrapper to set up TLS and DOCKER_HOST for the remote deployment.<br/>
⚠️ Resets `.docker/{ca,key,cert}.pem` before and after running the action. Sets and resets `DOCKER_HOST` and `DOCKER_VERIFY_TLS`.

## Inputs

- `tls_ca`
  - Raw content of the cert key (`~/.docker/ca.pem`)
  - Environment alternative: `SDR_TLS_ca`
- `tls_key`
  - Raw content of the private key (`~/.docker/key.pem`)
  - Environment alternative: `SDR_TLS_KEY`
- `tls_cert`
  - Raw content of the cert key (`~/.docker/cert.pem`)
  - Environment alternative: `SDR_TLS_CERT`
- `tcp_host`
  - TCP host, e.g. the hostname to connect to (the one used on server key `CN`) WITH port
  - Environment alternative: `SDR_TCP_HOST`

## Example usage

Without explicit `known_hosts` used:

```yaml
uses: blennster/setup-docker-remote-tls@v3
with:
  tls_ca: ${{ secrets.TLS_CA }}
  tls_key: ${{ secrets.TLS_PRIVATE_KEY }}
  tls_cert: ${{ secrets.TLS_CERT }}
  tcp_host: root.domain.example
```

With environment variables:

```yaml
name: 'remote-deploy'

on:
  push:
    branches: ['*']

env:
  SDR_TLS_CA: ${{ secrets.TLS_CA }}
  SDR_TLS_KEY: ${{ secrets.TLS_PRIVATE_KEY }}
  SDR_TLS_CERT: ${{ secrets.TLS_CERT }}
  SDR_TCP_HOST: ${{ secrets.DEV_SERVER_HOSTNAME }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 'Setup TLS and docker remote host'
        uses: blennster/setup-docker-remote-tls@v3

      - name: 'Execute docker ps via remote host'
        run: docker ps
```

## What it essentially does

```shell
rm -rf $HOME/.docker && \
  mkdir -pv $HOME/.docker && \
  echo "$tls_ca" > $HOME/.docker/ca.pem && \
  echo "$tls_key" > $HOME/.docker/key.pem && \
  echo "$tls_cert" > $HOME/.docker/cert.pem && \
  chmod 400 $HOME/.docker/{ca,key,cert}.pem && \

export DOCKER_HOST="tcp://$tcp_host"
export DOCKER_TLS_VERIFY=1
```

...and cleanup:

```shell
rm -rf $HOME/.docker/{ca,key,cert}.pem
unset DOCKER_HOST
unset DOCKER_TLS_VERIFY
```

## License

Licensed under MIT license.<br/>
Please also see [licenses.txt](lib_main/licenses.txt)
