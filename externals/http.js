const fetch = require('node-fetch')

module.exports = {
  get (url, params) {
    let paramsString = '?'

    if (params) {
      Object.keys(params).forEach(key => {
        paramsString += `${key}=${params[key]}&`
      })
    }

    return new Promise((resolve, reject) => {
      console.debug('Fetching', url + paramsString)
      fetch(url + paramsString)
        .then(response => {
          if (!response.ok) {
            console.error(`Error while fetching ${url}`.red)
            reject(response)
          }
          
          resolve(response.json())
        })
        .catch(error => {
          console.error(`Error while fetching ${url}`.red)
          reject(error)
        })
    })
  }
}