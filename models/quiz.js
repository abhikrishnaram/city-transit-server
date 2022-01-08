const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},	
	description: {
		type: String,
		required: false
	},
	cover_img_url: {
		type: String,
		required: false
	},
	questions: {
		type: [String],
		required: true
	},
	options:{
		type: [[]],
		required: false
	},
	q_type:{
		type: String,
		required: true
	},
	editable:{
		type: Boolean,
		default: false
	},
	author: {
		type: String,
		required: false
	},
	date: {
		type: String,
		default: Date.now
	},
	a_id: {
		type: String,
		required: true,
		unique: true
	}
})

module.exports = mongoose.model('QuizSchema',quizSchema);