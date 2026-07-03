# Security Policy

## BYOK Scope

KeyVault Chat is designed for bring-your-own-key usage. The project must not ship with maintainer-owned keys, demo secrets, private configs, or committed backup files.

## Local Storage Warning

API keys are user secrets. If stored in browser local storage, they are available to JavaScript running in this app origin and to anyone with access to the browser profile.

Use this project only on devices and browser profiles you trust.

## Reporting Security Issues

Please do not open public issues for suspected secret exposure or vulnerabilities. Contact the maintainer privately first, then publish details after a fix is available.

## Recommended Hardening

- Export safe configs without raw API keys.
- Add encrypted backups before supporting full-key export.
- Avoid putting provider keys in URLs.
- Do not cache provider API traffic in the service worker.
- Prefer a backend proxy for production deployments.
