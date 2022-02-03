const { Facilities } = require('../db')
const { facilitiesArray } = require('../config_db/facilities.array')

const createFacilitie = async (req,res)=>{
    const { name } = req.body
    try{
        const arr = []
        facilitiesArray.forEach(async (f)=>{
            const newFacilitie = await Facilities.findOrCreate({
                where:{
                    name:f.toLowerCase()
                }
            })    
            arr.push(newFacilitie)
        })
        res.status(200).json(arr)
    }catch(err){
        console.log(err)
    }
}

const getFacilities = async (req,res)=>{
    try{
        const facilities = await Facilities.findAll()
        res.status(200).json(facilities)
    }catch(err){
        res.status(404).json(err)
    }
}

module.exports = {
    createFacilitie,
    getFacilities
}