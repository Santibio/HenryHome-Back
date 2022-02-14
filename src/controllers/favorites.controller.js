const{ Housing, UserClint} = require("../db")

const addFavorite = (req,res)=>{
    const {idClient} = req.params
    const {id_hotel} = req.body 
    res.send('Holis')
}
module.exports = {addFavorite}