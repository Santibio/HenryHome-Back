require("dotenv").config();
const server = require("./src/server.js");
const { conn } = require("./src/db.js");
const PORT = process.env.PORT || 3002;


conn.sync({force:false}).then(() => {
  server.listen(PORT, () => {
    console.log(`"%s listening at ${PORT}`);
  });
});
