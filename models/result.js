const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
	playername: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},	
	questions: {
		type: [String],
		required: true
	},
	answers:{
		type: [String],
		required: true
	},
	score:{
		type: Number,
		required: true
	},
	date: {
		type: String,
		default: Date.now
	},
	url: {
		type: String,
		required: true,
	},
	org_id: {
		type: String,
		required: true
	},
	q_type: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('ResultSchema',resultSchema);