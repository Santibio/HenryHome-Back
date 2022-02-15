const {
    Housing,
    UserClient,
  } = require("../db");
const addFav = async (req, res, next)=>{
const { HousingId } = req.body
try{
    const client = await UserClient.findByPk(req.userId)
    
    await client.addFavs(HousingId)
    
    res.status(201).json(client)
}catch(error){
    next(error)}
}

const deleteFav = async (req, res, next)=>{
    const { HousingId } = req.body
    try{
        const client = await UserClient.findByPk(req.userId)
        
        await client.removeFavs(HousingId)
        
        res.status(201).json(client)
    }catch(error){
        next(error)}
    
}

module.exports={ addFav, deleteFav}