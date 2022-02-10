const { Router } = require("express");
const user = require('./user.route.js')
const house = require('./house.route.js')
const facilities = require('./facilities.route.js')
const services = require('./services.route.js')
const locations = require('./locations.route.js')
const reservation = require('./reservation.route.js')
const reviews = require('./reviews.route.js')

const router = Router()

router.use("/user",user)
router.use("/houses",house)
router.use('/facilities',facilities)
router.use('/services', services)
router.use("/locations", locations);
router.use('/reservation',reservation)
router.use('/reviews',reviews)


module.exports = router