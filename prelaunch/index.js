/**
 * This is the prelaunch file, it does all our initial setup crap.
 */

const fs = require('fs')
require('colors')

// Load the environment params in .env(s)
require('dotenv').config()

// Find files in the prelaunch folder, other than this file, and load them
const prelaunchFiles = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name !== 'index.js')

prelaunchFiles.reduce(async (promise, file) => {
  await promise;

  const module = require(`./${file.name}`)

  if (module.requiredDirectories) {
    module.requiredDirectories.forEach(dir => {
      const path = `./${dir}`
      console.debug(path)
      if (!fs.existsSync(path)) fs.mkdirSync(path)
    })
  }

  module.init()
}, undefined)