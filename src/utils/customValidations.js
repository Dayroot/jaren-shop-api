const boom = require('@hapi/boom');

const isString = (value) => {
	if(typeof value !== 'string') {
		throw boom.badRequest('The value must be of type string');
	}
};

const isNumericString = (value) => {
	if (typeof value !== 'string') {
		throw boom.badRequest('The value must be of type string');
	} else if (!(/^[0-9]+$/).test(value)) {
		throw boom.badRequest('The string content must be numeric');
	}
};

const isAlphaVerbose = (value) => {
	const regex = /^[a-z ]+$/i;
	if(!regex.test(value)) {
		throw boom.badRequest('The value must be alphabetic, spaces are also allowed');
	}
};

const isAlphaNumVerbose = (value) => {
	const regex = /^[a-zA-Z0-9 ]+$/;
	if(!regex.test(value)) {
		throw boom.badRequest('The value must be alphanumeric, spaces are also allowed');
	}
};

const isImageUrl = (url) => {
	const regex = /^(http|https):\/\/.*\.(png|jpg|svg)$/i;
	if(!regex.test(url)){
		throw boom.badRequest('You must enter a url that corresponds to an image');
	}
}
module.exports = {
	isString,
	isAlphaVerbose,
	isNumericString,
	isImageUrl,
	isAlphaNumVerbose,
}

