#!/usr/bin/env node

// shims yarn@1 so it dispatches to the yarn version pinned in `packageManager`.
const { spawnSync } = require('child_process');

const { status } = spawnSync('corepack', ['yarn', ...process.argv.slice(2)], { stdio: 'inherit' });

process.exit(status === null ? 1 : status);
