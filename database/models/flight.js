module.exports.init = (sequelize, { DataTypes, Model }) => {
  class Flight extends Model { }

  Flight.init({
    flight_iata: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Flight'
  })

  return Flight
}