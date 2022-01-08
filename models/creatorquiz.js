const mongoose = require('mongoose');

const creatorQuizSchema = new mongoose.Schema({
	key:{
		type: String,
		required: true
	},

	url: {
		type: String,
		required: true
	},
	questions: {
		type: [String],
		required: true
	},
	options:{
		type: [[]],
		required: true
	},
	answers:{
		type: [String],
		required: true
	},
	username: {
		type: String,
		required: false
	},
	location: {
		type: String,
		required: false
	},
	date: {
		type: String,
		default: Date.now
	},
	org_id: {
		type: String,
		required: true,
	}
})

module.exports = mongoose.model('CreatorQuizSchema',creatorQuizSchema);