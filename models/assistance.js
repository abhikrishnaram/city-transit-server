const mongoose = require('mongoose');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const assistanceSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	location:{
		type: String,
		required: true
	},	
	description: {
		type: String,
		required: false
	},
	vehicle_no: {
		type: String,
		required: true
	},
	contact_no: {
		type: String,
		required: true
	},
	date: {
		type: String,
		default: Date.now
	},	
	uid: {
		type: String,
		required: true
	},
})


assistanceSchema.pre('validate', function(next) {

  if (this.markdown) {
    const sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  	this.markdown = sanitizedHtml;  	
  }	

  next()
})


module.exports = mongoose.model('Assistance',assistanceSchema);