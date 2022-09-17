const {DataTypes, Model, QueryTypes, Op} = require('sequelize');
const conn = require('../connectionDB');

//Models
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const ProductVariant = require('./productVariant.model');
const Category = require('./category.model');

//Custom Validations
const {isString, isAlphaNumVerbose} = require('../../utils/customValidations');

class Product extends Model {}

Product.init({
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
			isAlphaNumVerbose,
		}

	},

	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isString,
		}
	},

	gender: {
		type: DataTypes.ENUM('men', 'woman', 'unisex', 'none'),
		allowNull: false,
	},

}, {
	sequelize: conn,
	modelName: 'product',
	timestamps: false,
	scopes: {
		format: {
			include: [
				{
					model: Brand,
				},
				{
					model: ProductImage,
					as: 'images',
					attributes: {
						exclude: ['productId']
					},
				},
				{
					model: ProductVariant,
					as: 'variants',
					attributes: {
						exclude: ['productId']
					},
				},
				{
					model: Category,
				}
			],
			attributes: {
				exclude: ['brandId', 'categoryId']
			},
			order: [['id', 'ASC'], [{model: ProductVariant, as: 'variants'}, 'id', 'ASC']],
		}
	},
	hooks: {
		afterFind: async (instances) => {
			if (instances instanceof Product){
				instances = [instances];
			}
			else if(!Array.isArray(instances) ) return;

			const productsId = instances.map(product => product.id);

			const reviews = await conn.query(
				`
				SELECT "productId", COUNT("productId") AS count, AVG(rating) AS average
				FROM reviews
				GROUP BY "productId"
				HAVING "productId" IN (${productsId.toString()});
				`,
				{
					type: QueryTypes.SELECT,
					raw: true,
				}
			);

			instances.forEach(product => {
				const {count, average} = reviews.find(review => review.productId === product.id) || {count: 0, average: 0};
				product.dataValues.reviewCount = +count;
				product.dataValues.reviewAverage = +(Math.round(average + 'e+1') + 'e-1')
			});
		},
	}
});


module.exports = Product;
