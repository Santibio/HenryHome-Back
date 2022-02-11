const { Housing, Reservations } = require("../db");

const validateDate = (id, dateStart, dateEnd) =>
  new Promise((resolve, reject) => {
      Housing.findByPk(id, { include: [{ model: Reservations }] }).then(
        (result) => {
          dateStart = new Date(dateStart);
          console.log({ dateStart });
          dateEnd = new Date(dateEnd);
          console.log({ dateEnd });
           for (let i = 0; i < result.Reservations.length; i++) {
             if (
               dateStart <= new Date(result.Reservations[i].date_start) &&
               dateEnd >= new Date(result.Reservations[i].date_end)
               ) {
               reject(new Error("Already reserved"));
             }
           }
          resolve(true);
        }
      );
      })
      .catch((error) => false);

module.exports = { validateDate};