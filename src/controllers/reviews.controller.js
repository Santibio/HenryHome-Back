const { UserClien, Housing, Reviews } = require("../db");

const createReview = async (req,res,next)=>{
  const { stars, description =null, id_hotel } = req.body
    try{
        const [hotel]= await Housing.findAll({where:{id: id_hotel},
            include:[{model:Reviews, where:{userClientId:req.userId}}]
        }) 
        
        if(hotel&&hotel.dataValues.Reviews.length){
            return res.status(400).json({message:"You cant post more than one review in the same post"})
        }
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
const patchReview = async (req,res,next)=>{
    const { id } = req.body
    try{
        const prev = await Reviews.findByPk(id)
        
    const { stars=prev.stars, description =prev.description } = req.body
        if(prev.userClientId!==req.userId){
            return res.status(400).json({message:"You must to be the creator user to update this Review"})
        }
        const New = await Reviews.update({stars,description},{where:{id}})
        
        res.status(200).json(New? {message:"Changes were applied"}:{message:"Something went rong"})
    }catch(error){console.log(error)
    next(error);
    }
}
const deleteReview = async (req,res,next)=>{
    const { id } = req.body
    try{
        const prev = await Reviews.findByPk(id)
        
        if(prev.userClientId!==req.userId){
            return res.status(400).json({message:"You must to be the creator user to delete this Review"})
        }
        const a = await Reviews.destroy({where:{id}})
        
        res.status(200).json(a? {message:"The review was destroyed"}:{message:"Something went rong"})
    }catch(error){console.log(error)
    next(error);
    }
}


module.exports = { createReview , patchReview, deleteReview};