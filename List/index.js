#!/usr/bin/env node

// Step - 1 => npm init - y (to initialize the package.json)
// Step - 2 => create a "bin" object with the name of your script to make it an executable
// Step - 3 => npm link (to link that bin globally and call your script)

//---------------------------------------------------------------------------------------------

const util = require("util");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

// //method #1
const lstat2 = (filename) => {
  return new Promise((resolve, reject) => {
    fs.lstat(filename, (err, stats) => {
      if (err) {
        reject(err);
      }

      resolve(stats);
    });
  });
};

//---------------------------------------------------------------------------------------------

//method #2
const { lstat } = fs.promises;

//---------------------------------------------------------------------------------------------

// //method #3
const lstat3 = util.promisify(fs.lstat);

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
  if (err) {
    console.log(err);
    throw new Error(err);
  }
  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename));
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);
    if (stats.isFile()) {
      console.log(chalk.italic.green(filenames[index]));
    } else {
      console.log(chalk.bold.red(filenames[index]));
    }
  }
});
