const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Reviews", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique:true
    },
    description: {
      type: DataTypes.TEXT,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
