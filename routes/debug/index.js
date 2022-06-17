const YAML = require('yaml')
const { getFlight, ping } = require('../../externals/flights')

module.exports = [
  {
    path: '/debug/ping',
    options: {
      method: 'GET',
      public: true
    },
    summary: 'Ping AirLabs API',
    tags: ['Debug'],
    async handler ({ response }) {
      const apiResponse = await ping()

      response.json(apiResponse)
    }
  },
  {
    path: '/debug/flights/:flightId',
    options: {
      method: 'GET',
      public: true
    },
    summary: 'Get Flight data from AirLabs API using a Flight ICAO',
    tags: ['Debug'],
    async handler ({ response, params }) {
      const flightId = params.flightId
      if (!flightId) {
        response.error(400, 'No flight ID provided')
        return
      }

      console.debug('Fetching flight', flightId)

      getFlight(flightId)
        .then(flightData => {
          response.json(flightData)
        })
        .catch(flightData => {
          console.error('Error fetching flight data', flightData)
          response.error(502, 'Error fetching flight data', {
            data: flightData
          })
        })
    }
  },
  {
    path: '/debug/spec',
    options: {
      method: 'GET',
      public: true
    },
    summary: 'Get OpenAPI Spec in YAML format',
    tags: ['Debug'],
    async handler ({ response }) {
      const api = process.trestleapi

      const spec = api.getSpec() || ""

      console.debug(spec)

      response.text(spec)

    }
  },
  {
    path: '/debug/process',
    options: {
      method: 'GET',
      public: true
    },
    summary: 'Get process info (vv illegal)',
    tags: ['Debug'],
    async handler ({ response }) {
      response.json({
        env: process.env,
        argv: process.argv,
        pid: process.pid,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        cwd: process.cwd(),
        execPath: process.execPath,
        execArgv: process.execArgv,
        versions: process.versions,
        config: process.config,
        arch: process.arch,
        platform: process.platform,
        title: process.title,
        trestleapi: process.trestleapi
      })
    }
  }
]