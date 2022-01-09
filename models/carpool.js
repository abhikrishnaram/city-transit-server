const mongoose = require('mongoose');

const carpoolSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true
	},
    need: {
        type: Boolean,
        required: false,
        default: true
    },
	from: {
		type: String,
		required: true
	},	
	to: {
		type: [String],
		required: true
	},
	date:{
		type: [String],
		required: true
	},
	time:{
		type: Number,
		required: false
	},
    accepted:{
		type: Boolean,
		required: false,
        default: false
	},
    accepted_by_id:{
		type: String,
		required: false
	},
	req_date: {
		type: String,
		default: Date.now
	},	
})

module.exports = mongoose.model('Carpool',carpoolSchema);