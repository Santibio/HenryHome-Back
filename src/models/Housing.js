const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define("Housing", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricePerNight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    numberOfPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfBeds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: this.numberOfPeople,
    },
    description: {
      type: DataTypes.TEXT,
    },
    houseRules: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    image:{
       type: DataTypes.TEXT,
    },
    average: {
      type: DataTypes.VIRTUAL,
      
      get(){
        const estrellas =this.Reviews
        var total = 0
        if(!estrellas){
          return "Se requiere el modelo Reviews para ver el promedio"
        }
        if(estrellas.length){
          estrellas.forEach(e => {total+=e.stars});
          return (total/estrellas.length).toFixed(1)
        }
        
        return 0
      },
    }
  });
};
