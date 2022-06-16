const fs = require('fs')
const { DateTime } = require('luxon')
const colors = require('colors')

const logTypes = {
  warn: {
    prefix: colors.red(' WARNING ').bgYellow
  },
  debug: {
    prefix: colors.rainbow(' DEBUG ').bgWhite
  },
  depreciated: {
    prefix: colors.yellow(' DEPRECIATED ').bgRed
  },
  log: { prefix: null }
}

function writeToLogs (options = { type: 'log' }, args) {
  // convert arguments to array
  args = Array.prototype.slice.call(args)

  // Work out date and time
  const dt = DateTime.local()
  const time = dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS)

  // Setup filepath and start the string value
  const filePath = './logs/' + dt.toISODate() + '.log'
  let stringValue = `[${time}] `.cyan

  if (options.type && logTypes[options.type]?.prefix) {
    stringValue += logTypes[options.type].prefix + ' '
  }

  // Parse the arguments and format them into a string
  args.forEach(arg => {
    if (typeof arg === 'string') {
      stringValue += arg + ' '
    } else {
      stringValue += '\n' + JSON.stringify(arg) + ' \n'
    }
  })

  stringValue += '\n' // Add a new line at the end of the log

  fs.writeFileSync(filePath, stringValue, { flag: 'a' })
  fs.writeFileSync('./logs/latest.log', stringValue, { flag: 'a' })

  return { dt, time }
}

// Override the console.log function so format it better,
// Aswell as append it all to a .log file.
const originalLog = console.log
console.olog = originalLog // for debug purposes
console.log = function () {
  const { time } = writeToLogs(undefined, arguments)

  originalLog.apply(console, [`[${time}]`.brightBlue, ...arguments])
}

const originalWarn = console.warn
console.warn = function () {
  const { time } = writeToLogs({ type: 'warn' }, arguments)

  originalWarn.apply(console, [`[${time}]`.brightBlue, logTypes.warn.prefix, ...arguments])
}

console.debug = function () {
  const { time } = writeToLogs({ type: 'debug' }, arguments)

  originalLog.apply(console, [`[${time}]`.brightBlue, logTypes.debug.prefix, ...arguments])
}

console.warnDepreciated = function () {
  const { time } = writeToLogs({ type: 'depreciated' }, arguments)

  originalWarn.apply(console, [`[${time}]`.brightBlue, logTypes.depreciated.prefix, ...arguments])
}

module.exports = {
  requiredDirectories: ['logs'],
  init () {
    setInterval(() => {
      try {
        // Copy todays log file to latest.log
        fs.copyFileSync('./logs/' + DateTime.local().toISODate() + '.log', './logs/latest.log', fs.constants.COPYFILE_FICLONE)
      } catch (err) {
        console.error('Error copying log file to latest.log:', err)
      }
    }, 1000 * 60 * 60 * 1) // 1 hour
  }
}