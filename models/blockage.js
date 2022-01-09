const mongoose = require('mongoose');

const blockageSchema = new mongoose.Schema({
	uid:{
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	description: {
		type: [String],
		required: true
	},	
	date: {
		type: String,
		default: Date.now
	},	
})

module.exports = mongoose.model('Blockage',blockageSchema);