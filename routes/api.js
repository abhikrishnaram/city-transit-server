const express = require('express')
const Assistance = require('../models/assistance.js')
const CarbonFP = require('../models/carbon.js')
const Blockage = require('../models/blockage.js')
const Booking = require('../models/Booking.js')
const Carpool = require('../models/carpool.js')
const router = express.Router()

const gpkm = 251
const speed = 25

router.get('/reqestassistance', async (req, res) => {
    const assistance = await Assistance.find().sort({date: 'desc'});    
    res.status(200).json(assistance)
});

router.post('/reqestassistance', async (req, res) => {     
    const assistance = new Assistance({
		title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        vehicle_no: req.body.vehicle_no,
        contact_no: req.body.contact_no,
        date: req.body.date,
        uid: req.body.uid,
	})    
	await assistance.save()
	res.send(assistance)    
});




router.get('/reportblockage', async (req, res) => {
    const blockage = await Blockage.find().sort({date: 'desc'});    
    res.status(200).json(blockage)
});

router.post('/reportblockage', async (req, res) => {
    console.log(req.body)    
    const blockage = new Blockage({
		uid: req.body.uid,
        location: req.body.location,
        description: req.body.description,        
	})    
	await blockage.save()
	res.send(blockage)    
});




router.get('/mycarbonFP/:uid', async (req, res) => {
    const carbon = await CarbonFP.findOne({ uid: req.param.uid });  
    console.log(carbon);
    res.status(200).json(carbon)
});

router.post('/mycarbonFP', async (req, res) => {
    console.log(req.body)    
    const carbon = new CarbonFP({
		uid: req.body.uid,
        cfp: req.body.cfp,
	})
    console.log(carbon)
	// await blockage.save()
	// res.send(blockage)    
});




router.get('/booking/:uid', async (req, res) => {
    try {
        const booking = await Booking.find({uid: req.param.uid});
        res.status(200).json(booking)
    } catch (e) {
        res.json('error = '+e);
    }
});

router.get('/booking/me/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json(booking)
    } catch (e) {
        res.json('error = '+e);
    }
});

router.post('/bookjourney', async (req, res) => {
    const totemission = (parseFloat(req.body.duration)/60.0)*speed*gpkm
    const booking = new Booking({
        uid: req.body.uid,
        from: req.body.from,
        to: req.body.to,
        cost: req.body.cost,
        from_id: req.body.from_id,
        to_id: req.body.to_id,
	})
    console.log(typeof(totemission))

	await booking.save()
	CarbonFP.findOneAndUpdate({ uid: req.body.uid }, { $inc: { cfp: totemission } }, {new: true },function(err, response) {
        if (err) {
            console.log(err);
       } else {
            console.log("emission added");
       }
    });
    res.send(booking)
});


router.get('/carpool/list', async (req, res) => {
    try {
        const carpool = await Carpool.find({need: true});
        res.status(200).json(carpool)
    } catch (e) {
        res.json('error = '+e);
    }
});

router.post('/carpool/have', async (req, res) => {
    console.log(req.body)    
    const carpool = new Carpool({
        uid: req.body.uid,
        need: false,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        time: req.body.time,
        accepted: false,
        accepted_by_id: "",
	})
    console.log(carpool)
	// await booking.save()
	// res.send(booking)    
});

router.post('/carpool/need', async (req, res) => {
    console.log(req.body)    
    const carpool = new Carpool({
        uid: req.body.uid,
        need: true,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        time: req.body.time,
        accepted: req.body.accepted,
        accepted_by_id: req.body.accepted_by_id,
	})
    console.log(carpool)
	// await booking.save()
	// res.send(booking)    
});



module.exports = router