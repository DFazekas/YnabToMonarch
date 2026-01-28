import process from 'node:process';

const REQUIRED_VERSION = '20.19.0';

function parse(version) {
  return version.split('.').map((segment) => Number.parseInt(segment, 10));
}

function isSatisfied(current, required) {
  for (let i = 0; i < required.length; i += 1) {
    if (current[i] > required[i]) return true;
    if (current[i] < required[i]) return false;
  }
  return true;
}

const currentVersion = parse(process.versions.node);
const minimumVersion = parse(REQUIRED_VERSION);

if (!isSatisfied(currentVersion, minimumVersion)) {
  console.error(`\n❌ Node ${REQUIRED_VERSION} or newer is required for this project.`);
  console.error(`Current version: v${process.versions.node}`);
  console.error('Use nvm (or a similar manager) to run `nvm install` && `nvm use` inside this repo.');
  process.exit(1);
}

console.log(`✅ Node version check passed (v${process.versions.node})`);
