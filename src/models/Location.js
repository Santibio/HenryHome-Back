const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define(
    "Location",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat:{
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lng:{
        type: DataTypes.FLOAT,
        allowNull: true,
      }
    },
    { timestamps: false }
  );
};
