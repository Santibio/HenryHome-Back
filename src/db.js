require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const DB_NAME = process.env.DB_NAME || "henryhome";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgre";

let sequelize;
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
    },
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    native: false,
    logging: false,
  });
}

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Facilities,
  Housing,
  Location,
  Order,
  Reservations,
  Services,
  UserAdmin,
  UserClient,
  UserMod,
  Reviews,
} = sequelize.models;

//relaciones
Housing.belongsToMany(
  Facilities,
  { through: "Housing_Facilities", timestamps: false }

);

Facilities.belongsToMany(Housing, {
  through: "Housing_Facilities",
  timestamps: false,
});

Housing.belongsToMany(
  Services,
  { through: "Housing_Services", timestamps: false  },
 
);

Services.belongsToMany(
  Housing,
  { through: "Housing_Services" , timestamps: false },
 
);

UserClient.belongsToMany(Housing, 
   { through: "ClientFavs-HousingFavs" , timestamps: false, as: 'favs'},
   
);

Housing.belongsToMany(UserClient, 
  { through: "ClientFavs-HousingFavs" , timestamps: false, as: 'favs'},
  
);

UserClient.hasMany(Reservations, {timestamps: false})
Reservations.belongsTo(UserClient, {timestamps:false});

Housing.hasMany(Reservations, {timestamps: false})
Reservations.belongsTo(Housing, {timestamps:false});

UserClient.hasMany(Reviews, {timestamps: false})
Reviews.belongsTo(UserClient, {timestamps:false});

Housing.hasMany(Reviews, {timestamps: false})
Reviews.belongsTo(Housing, {timestamps:false});

Location.hasMany(Housing, { timestamps: false });
Housing.belongsTo(Location, { timestamps: false });

Order.hasOne(Reservations, { timestamps: false });
Reservations.belongsTo(Order, { timestamps: false });

UserMod.hasMany(Housing, { timestamps: false });
Housing.belongsTo(UserMod), { timestamps: false };

UserMod.hasOne(UserClient, { timestamps: false });
UserClient.belongsTo(UserMod, { timestamps: false });



module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
