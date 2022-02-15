const { Op } = require("sequelize");
module.exports =  (req)=> {
    filters = {};
    
    if(req.body){
        //price
        if (req.body.minPrice && req.body.maxPrice) {
        filters.pricePerNight={[Op.between]: [req.body.minPrice, req.body.maxPrice]}
      }else{
          if(req.body.minPrice){
            filters.pricePerNight={[Op.gte]: req.body.minPrice }
          }
          if(req.body.maxPrice){
            filters.pricePerNight={[Op.lte]: req.body.maxPrice }
        }
      }
      //People
      if (req.body.numberOfPeople) {
        filters.numberOfPeople = req.body.numberOfPeople
      }
      //Beds
      if (req.body.numberOfBeds) {
        filters.numberOfBeds = req.body.numberOfBeds
      }
      //status
      if (req.body.status) {
        filters.status = req.body.status
      }
      
    }
    
    return filters;
  }