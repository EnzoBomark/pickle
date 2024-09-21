const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'));
config.exclude = [];

config.jsc.baseUrl = __dirname;

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        ...config,
        swcrc: false,
      },
    ],
  },
};
