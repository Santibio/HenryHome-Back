const { UserClien, Housing, Reviews } = require("../db");

const createReview = async (req,res,next)=>{
  const { stars, description =null, id_hotel } = req.body
    try{
        if(stars <1 || stars > 5){
            return res.status(400).json({message:"stars value must to be (1-5)"})
        }
    const newReview= await Reviews.create({stars,description})
    await newReview.setUserClient(req.userId);
    await newReview.setHousing(id_hotel)
    res.status(201).json(newReview)
    }catch(error){console.log(error)
    next(error);
    }

}



module.exports = { createReview };