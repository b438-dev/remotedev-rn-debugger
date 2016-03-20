'use strict';

const fs = require('fs');
const path = require('path');
const name = 'remote-redux-devtools-on-debugger';
const startFlag = `/* ${name} start */`;
const endFlag = `/* ${name} end */`;
const serverPath = 'local-cli/server/server.js';
const serverFlag = '    _server(argv, config, resolve, reject);';

exports.inject = (modulePath, options) => {
  const opts = Object.assign({}, options, { runserver: true });
  const code =
    `${startFlag}\n` +
    '    console.log("[RemoveDev] Server starting...");\n' +
    '    console.log("-".repeat(80) + "\\n");\n' +
    `    require("${name}")(${JSON.stringify(opts)})\n` +
    '      .on("ready", () => {\n' +
    '        console.log("-".repeat(80));\n' +
    `    ${serverFlag}\n` +
    '      });\n' +
    `${endFlag}`;

  const filePath = path.join(modulePath, serverPath);
  const serverCode = fs.readFileSync(filePath, 'utf-8');
  let start = serverCode.indexOf(startFlag);  // already injected ?
  let end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start === -1) {
    start = serverCode.indexOf(serverFlag);
    end = start + serverFlag.length;
  }
  fs.writeFileSync(
    filePath,
    serverCode.substr(0, start) + code + serverCode.substr(end, serverCode.length)
  );
};

exports.revert = (modulePath) => {
  const filePath = path.join(modulePath, serverPath);
  const serverCode = fs.readFileSync(filePath, 'utf-8');
  const start = serverCode.indexOf(startFlag); // already injected ?
  const end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) + serverFlag + serverCode.substr(end, serverCode.length)
    );
  }
};
