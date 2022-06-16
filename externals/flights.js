const http = require('./http')

const baseURL = 'https://airlabs.co/api/v9'

const baseParams = {
  api_key: process.env.AIRLABS_API_KEY
}

function get (url, params) {
  return new Promise(async (resolve, reject) => {
    const flightData = await http.get(url, {...baseParams,...params})

    if (flightData.response) resolve(flightData.response)
    else {
      console.error('Error fetching flight data', flightData)
      resolve(flightData)
    }
  })
}

module.exports = {
  async ping () {
    return get(`${baseURL}/ping`)
  },
  async getFlight (flight_iata) {
    if (!flight_iata) return Promise.reject(new Error('No flight IATA provided'))

    return get(`${baseURL}/flight`, { flight_iata })
  }
}