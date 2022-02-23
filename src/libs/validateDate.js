const { Housing, Reservations } = require("../db");
const moment = require("moment");

const validateDate = (id, dateStart, dateEnd) =>
  new Promise((resolve, reject) => {
    Housing.findByPk(id, { include: [{ model: Reservations }] }).then(
      (result) => {
      
        dateStart = moment(dateStart).format("YYYY-MM-DD");
        dateEnd = moment(dateEnd).format("YYYY-MM-DD");

        const resultFilter = result.Reservations?.filter(e=>e.status==="approved")
       
        for (let i = 0; i < resultFilter.length; i++) {
          console.log(
            dateStart ==
              moment(result.Reservations[i].date_start).format("YYYY-MM-DD"),
            i
          );
          if (
            dateStart <=
              moment(result.Reservations[i].date_start).format("YYYY-MM-DD") &&
            dateEnd >=
              moment(result.Reservations[i].date_end).format("YYYY-MM-DD")
          ) {
            console.log("entro");
            reject(new Error("Already reserved"));
          }
        }
        resolve(true);
      }
    );
  }).catch((error) => false);

module.exports = { validateDate };
