#!/usr/bin/env node

const argv = require('yargs')
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .help()
  .argv;
