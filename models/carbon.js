const mongoose = require('mongoose');

const carbonSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true
	},	
	cfp: {
		type: Number,
		required: false
	},	
	updated_date: {
		type: String,
		default: Date.now
	}
})

module.exports = mongoose.model('CarbonFP',carbonSchema);