
exports.brandsData = [
	{
		name: "DIOR",
		logoUrl: "http://diorlogo.png",
	},
	{
		name: "CHANEL",
		logoUrl: "http://chanellogo.png",
	},
	{
		name: "YVES SAINT LAURENT",
		logoUrl: "http://ivessaintlaurentlogo.png",
	},
];

exports.productsData = [
	{
		brandId: 1,
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 350.01, SKU:"DIO-SAU-30", UPC:"145836584321", stock: 10},
			{size:"60", price: 450.01, SKU:"DIO-SAU-60", UPC:"145836584322", stock: 18},
			{size:"100", price: 649.99, SKU:"DIO-SAU-100", UPC:"145836584323", stock: 12}
		],
		categoryId: 1,
	},
	{
		brandId: 2,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 550.01, SKU:"CHA-BLE-30", UPC:"145836584324", stock: 80},
			{size:"60", price: 850.01, SKU:"CHA-BLE-60", UPC:"145836584325", stock: 48},
			{size:"100", price: 1149.99, SKU:"CHA-BLE-100", UPC:"145836584326", stock: 242}
		],
		categoryId: 1,
	},
	{
		brandId: 3,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
		gender: 'woman',
		variants: [
			{size:"30", price: 1250.01, SKU:"YSL-BOP-30", UPC:"145836584327", stock: 260},
			{size:"60", price: 1950.01, SKU:"YSL-BOP-60", UPC:"145836584328", stock: 187},
			{size:"100", price: 2349.99, SKU:"YSL-BOP-100", UPC:"145836584329", stock: 122}
		],
		categoryId: 1,
	}
];
