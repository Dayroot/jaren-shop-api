//Models
const Perfume = require('../db/models/perfume.model');
const PerfumeSize = require('../db/models/perfumeSize.model');

class PerfumeService {

	static add = async ({gender, pricesPerSize}) => {
		const PerfumeSizes = pricesPerSize.map(item => {
			return {
				size: item.size,
				"PerfumePrice": {
					price: item.price,
				}
			}
		});
		return await Perfume.create({ gender, PerfumeSizes }, { include: PerfumeSize});
	}

	static findOne = async (id) => {
		return await Perfume.findByPk(id);
	}
}

module.exports = PerfumeService;
