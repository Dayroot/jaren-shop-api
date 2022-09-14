const {DataTypes, Model, QueryTypes, Op} = require('sequelize');
const conn = require('../connectionDB');

//Models
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const Price = require('./price.model');
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

	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			isInt: true,
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
		available: {
			where: {
				stock: {
					[Op.gt]: 0,
				}
			}
		},
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
					model: Price,
					attributes: {
						exclude: ['productId']
					}
				},
				{
					model: Category,
				}
			],
			attributes: {
				exclude: ['brandId', 'categoryId']
			},
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
