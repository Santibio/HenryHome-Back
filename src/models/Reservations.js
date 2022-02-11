const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define(
    "Reservations",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique:true
      },
      id_hotel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      date_end:{
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      detail:{
        type: DataTypes.TEXT,
        allowNull: false,
      }
      ,
      status:{
        type: DataTypes.STRING,
        defaultValue: "Pending",
      }
    },
    { timestamps: true }
  );
};
