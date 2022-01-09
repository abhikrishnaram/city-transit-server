const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true
	},
	from: {
		type: String,
		required: true
	},	
	to: {
		type: [String],
		required: true
	},
	cost:{
		type: [String],
		required: true
	},
	from_id:{
		type: Number,
		required: false
	},
	to_id:{
		type: Number,
		required: false
	},
	date: {
		type: String,
		default: Date.now
	},	
})

module.exports = mongoose.model('Booking',bookingSchema);