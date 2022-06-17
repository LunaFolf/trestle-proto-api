require('./prelaunch')
const { TrestleAPI, TrestleDatabase } = require('@whiskeedev/trestle')
const pjson = require('./package.json')

const titleCard = '[index.js]'.magenta

// Check if we should be running in secureMode or not
const secureMode = String(process.env.SECURE_MODE).toLowerCase() === 'true'

// Create a new TrestleAPI instance
const api = new TrestleAPI({
  port: process.env.API_PORT,
  specStrict: true,
  secureMode,
  appName: 'Trestle Proto API',
  appVersion: pjson.version,
  appDescription: pjson.description
})
process.trestleapi = api
// api.secureMode = secureMode

if (secureMode && (process.env.SSL_KEY && process.env.SSL_CERT)) {
  // If we are in secure mode, attempt to set the SSL key and cert
  const key = fs.readFileSync(process.env.SSL_KEY).toString()
  const cert = fs.readFileSync(process.env.SSL_CERT).toString()

  api.setSSL(key, cert)
} else if (secureMode) {
  // If we can't set the SSL key and cert, but we are still attempting to run in secure mode, throw an error
  throw new Error('Could not set SSL key and cert. Please check that the SSL_KEY and SSL_CERT environment variables are set.')
}

// require('./database').then(() => {
//   console.log(titleCard, 'Database successfully initialized.'.green)

//   // Incorporate the routes
//   const { routes } = require('./routes')
//   routes.forEach(route => api.addRoute(route))

//   // Start the API
//   api.init()

//   api.getSpec()
// })

const { DATABASE_NAME, DATABASE_USER, DATABASE_HOST, DATABASE_PORT } = process.env
const database = new TrestleDatabase(DATABASE_NAME || 'trestle-proto-api', DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT || '3306'
})

// Incorporate the routes
const { routes } = require('./routes')
routes.forEach(route => api.addRoute(route))

// Start the API
api.init()