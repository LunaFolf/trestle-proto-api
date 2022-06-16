const { Sequelize, DataTypes, Model } = require('sequelize')
const fs = require('fs')
const env = process.env
const titleCard = '[Database]'.yellow
require('colors')

async function createDatabase () {
  const sequelizeConnection = new Sequelize(env.DATABASE_NAME || 'trestle-proto-api', env.DATABASE_USER, env.DATABASE_PASSWORD, {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT || '3306',
    dialect: 'mysql',
    logging: false,
    define: {
      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_520_ci'
      },
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_520_ci'
    }
  })

  process.database = sequelizeConnection // Easy access to the database connection from anywhere in the application

  if (fs.existsSync('./database/models')) {
    // Setup models
    const modelFiles = fs.readdirSync('./database/models').filter(file => file.endsWith('.js')).map(file => require(`./models/${file}`))
    const models = {}

    modelFiles.forEach(file => {
      const model = file.init(sequelizeConnection, { DataTypes, Model })
      console.log(titleCard, 'Model', model.name.cyan, 'loaded')

      models[model.name] = model
    })

    // Setup associations
    modelFiles.forEach(file => {
      if (file.associate) file.associate(models)
    })
  }

  //Sync the database
  await sequelizeConnection.sync({ force: false, alter: true })
    .catch(error => {
      console.error(titleCard, 'Error while syncing the database'.red, error)
      process.exit(1)
    })
}

module.exports = new Promise(async resolve => {
  await createDatabase()
  resolve()
})