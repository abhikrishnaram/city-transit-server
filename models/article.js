const mongoose = require('mongoose');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	seo_title: {
		type: String,
		required: false		
	},
	description: {
		type: String,
		required: false
	},
	img_url: {
		type: String,
		required: false
	},
	markdown: {
		type: String,
		required: true
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


articleSchema.pre('validate', function(next) {

  if (this.markdown) {
    const sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  	this.markdown = sanitizedHtml;  	
  }	

  next()
})


module.exports = mongoose.model('Article',articleSchema);