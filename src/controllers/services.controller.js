const { Services } = require("../db");
const { servicesArray } = require("../config_db/services.array.js");

const createService = async (req, res) => {
  const { name } = req.body;
  try {
    if (name) {
      const [service,result] = await Services.findOrCreate({
        where: { name: name.toLowerCase() },
      });
      return res
        .status(201)
        .json(
          result
            ? { message: "El servicio se ha creado correctamente", service }
            : { message: "Ya existe un servicio con ese nombre", service }
        );
    } else {
      res.status(400).json({ message: "Se requiere mas informacion" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getServices = async (req, res) => {
  try {
    servicesArray.forEach(async (e) => {
      await Services.findOrCreate({
        where: {
          name: e.toLowerCase(),
        },
      });
    });

    const services = await Services.findAll();
    res.json(services);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { createService, getServices };
