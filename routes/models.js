const routes = []

const models = process.database.models
// console.debug(models)
Object.keys(models).forEach(modelName => {
  const model = models[modelName]

  let modelPathName = modelName.toLowerCase()
  if (!modelPathName.endsWith('s')) modelPathName += 's'
  modelPathName = `/${modelPathName}`

  const rawAttributes = Object.keys(model.rawAttributes)

  // GET index
  routes.push({
    path: modelPathName,
    options: {
      method: 'GET',
      public: true
    },
    async handler ({ response, query }) {
      const filters = rawAttributes.filter(attribute => Object.keys(query).includes(attribute))
      const data = await model.findAll({
        order: [['createdAt', 'ASC']]
      })
      const filteredData = data.filter(item => {
        return filters.every(filter => {
          return String(item[filter]).toLowerCase().startsWith(String(query[filter]).toLowerCase())
        })
      })
      response.json(filteredData)
    }
  })

  // GET show
  routes.push({
    path: `${modelPathName}/:id`,
    options: {
      method: 'GET',
      public: true
    },
    async handler ({ response, params }) {
      const data = await model.findOne({ where: { id: params.id } })
      response.json(data)
    }
  })

  // POST create
  routes.push({
    path: modelPathName,
    options: {
      method: 'POST',
      public: true
    },
    async handler ({ response, bodyData }) {
      try {
        const data = await model.create(bodyData)
        response.json(data)
      } catch (error) {
        response.error(500, error.message || 'An unknown error occured', { data: error })
      }
    }
  })
})


module.exports = routes