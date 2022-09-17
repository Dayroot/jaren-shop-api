const overviewCreator = ({category, brand, productName, size, gender}) => {
	if(!category || !brand || !productName ) throw Error('Incomplete data');
	return `${category} ${gender && `for ${gender}`} ${productName} ${size && size} brand ${brand}`;
};

module.exports = overviewCreator;
