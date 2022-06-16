const YAML = require('yaml')
const { getFlight, ping } = require('../../api/flights')

module.exports = [
  {
    path: '/debug/ping',
    options: {
      method: 'GET',
      public: true
    },
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
    async handler ({ response, params }) {
      const flightId = params.flightId
      if (!flightId) {
        response.error(400, 'No flight ID provided')
        return
      }

      console.debug('Fetching flight', flightId)

      const flight = await getFlight(flightId)

      console.debug(JSON.stringify(flight))

      response.json(flight)
    }
  },
  {
    path: '/debug/spec',
    options: {
      method: 'GET',
      public: true
    },
    async handler ({ response }) {
      const api = process.trestleapi

      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Trestle Proto API',
          version: '1.0.0'
        },
        paths: {}
      }

      api.routes.forEach(route => {
        const { path, method } = route

        spec.paths[path] = {
          [String(method).toLowerCase()]: {
            summary: '',
            description: '',
            responses: {
              200: {
                description: 'JSON response'
              }
            }
          }
        }
      })

      const openapiSpec = new YAML.Document()
      openapiSpec.contents = spec

      response.text(openapiSpec.toString())

    }
  },
  {
    path: '/debug/process',
    options: {
      method: 'GET',
      public: true
    },
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