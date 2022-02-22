const { Op } = require("sequelize");
module.exports =  (req)=> {
    filters = {};
    
    if(req.query){
        //price
        if (req.query.minPrice && req.query.maxPrice) {
        filters.pricePerNight={[Op.between]: [req.query.minPrice, req.query.maxPrice]}
      }else{
          if(req.query.minPrice){
            filters.pricePerNight={[Op.gte]: req.query.minPrice }
          }
          if(req.query.maxPrice){
            filters.pricePerNight={[Op.lte]: req.query.maxPrice }
        }
      }
      //People
      if (req.query.numberOfPeople) {
        filters.numberOfPeople ={[Op.gte]: req.query.numberOfPeople}
      }
      //Beds
      if (req.query.numberOfBeds) {
        filters.numberOfBeds = {[Op.gte]:req.query.numberOfBeds}
      }
      //status
      if (req.query.status) {
        filters.status = req.query.status
      }
      
    }
    
    return filters;
  }