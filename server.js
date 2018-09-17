/** @format */

const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const ADD_ONE_IN_BASKET = 'ADD_ONE_IN_BASKET';
const REMOVE_ONE_IN_BASKET = 'REMOVE_ONE_IN_BASKET';
const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
const CATEGORY_WOMEN_FOOTWEAR = `Women’s Footwear`;
const CATEGORY_MEN_FOOTWEAR = `Men’s Footwear`;
const INVALID_VOUCHER = 'INVALID_VOUCHER';
const VOUCHER_ON_EMPTY_BASKET = 'VOUCHER_ON_EMPTY_BASKET';
const VOUCHER_ALREADY_APPLIED = 'VOUCHER_ALREADY_APPLIED';

const computeTotalPrice = (products) =>
	products.reduce((acc, curr) => ({
		totalPrice: acc.totalPrice + curr.totalPrice,
	}));

const computeProductsCount = (products) =>
	products.reduce((acc, curr) => ({
		quantity: acc.quantity + curr.quantity,
	}));

const applyVoucher = (db, total, voucher = null) => {
	const basket = db.get('basket').value();

	const noVoucher = 0;
	const voucher5 = 5;
	const voucher10 = 10;
	const voucher15 = 15;

	const footerWearProduct = basket.products.find((product) => {
		return (
			[CATEGORY_WOMEN_FOOTWEAR, CATEGORY_MEN_FOOTWEAR].includes(
				product.category
			) && product.quantity > 0
		);
	});

	voucher = voucher || basket.voucher.value;

	if (voucher) {
		db.set('basket.voucher.value', voucher).write();
		return voucher;
	} else if (total > 75 && footerWearProduct) {
		return voucher15;
	} else if (total > 50) {
		return voucher10;
	} else if (total > voucher5) {
		return voucher5;
	} else {
		return noVoucher;
	}
};

// Create server
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// Create database instance and start server
const adapter = new FileAsync('db.json');
low(adapter)
	.then((db) => {
		// Routes
		app.get('/products', (req, res) => {
			const products = db.get('products').value();
			return res.jsonp(products);
		});

		app.get('/basket', (req, res) => {
			const basket = db.get('basket').value();
			return res.jsonp(basket);
		});

		app.post('/buy', (req, res) => {
			db.set('basket', {
				total: 0,
				totalWithVoucher: 0,
				productsCount: 0,
				voucher: {},
				products: [],
			}).write();

			res.sendStatus(200);
		});

		app.post('/vouchers', (req, res) => {
			const voucher = db.get('vouchers').value()[req.body.voucher];
			const basket = db.get('basket').value();

			if (!voucher) {
				return res.status(500).send(INVALID_VOUCHER);
			}

			if (!basket.products.length) {
				return res.status(500).send(VOUCHER_ON_EMPTY_BASKET);
			}

			if (basket.voucher.name === req.body.voucher) {
				return res.status(500).send(VOUCHER_ALREADY_APPLIED);
			}

			const total = computeTotalPrice(basket.products).totalPrice;
			const totalWithVoucher = total - applyVoucher(db, total, voucher);

			db.get('basket')
				.assign({
					total,
					totalWithVoucher,
					voucher: {
						name: req.body.voucher,
						value: voucher,
					},
				})
				.write();

			return res.sendStatus(200);
		});

		app.post('/basket', (req, res) => {
			const product = db.get('products').find({ id: req.body.product.id });

			const getProductsBasket = db.get('basket.products');
			const alreadyInBasketRequest = getProductsBasket.find({
				id: req.body.product.id,
			});

			const alreadyInBasket = alreadyInBasketRequest.value();

			if (req.body.type === ADD_ONE_IN_BASKET) {
				if (alreadyInBasket) {
					const quantity = alreadyInBasket.quantity + 1;
					const totalPrice = quantity * parseFloat(alreadyInBasket.price, 10);

					product.assign({ quantity: product.value().quantity - 1 }).write();
					alreadyInBasketRequest.assign({ quantity, totalPrice }).write();
				} else {
					product.assign({ quantity: product.value().quantity - 1 }).write();

					getProductsBasket
						.push({
							...req.body.product,
							quantity: 1,
							totalPrice: parseFloat(req.body.product.price, 10),
						})
						.write();
				}
			}

			if (req.body.type === REMOVE_ONE_IN_BASKET) {
				const quantity = alreadyInBasket.quantity - 1;
				const totalPrice = quantity * parseFloat(alreadyInBasket.price, 10);

				product.assign({ quantity: product.value().quantity + 1 }).write();
				alreadyInBasketRequest.assign({ quantity, totalPrice }).write();
			}

			if (req.body.type === REMOVE_PRODUCT) {
				if (alreadyInBasket) {
					product
						.assign({
							quantity: product.value().quantity + alreadyInBasket.quantity,
						})
						.write();
				}

				db.get('basket.products')
					.remove({ id: req.body.product.id })
					.write();
			}

			let total = 0;
			let productsCount = 0;
			let totalWithVoucher = 0;

			if (db.get('basket.products').value().length) {
				total = computeTotalPrice(db.get('basket.products').value()).totalPrice;
				productsCount = computeProductsCount(db.get('basket.products').value())
					.quantity;
				totalWithVoucher = total - applyVoucher(db, total);
			}

			db.get('basket')
				.assign({
					total,
					totalWithVoucher,
					productsCount,
				})
				.write();

			return res.sendStatus(200);
		});
	})
	.then(() => {
		app.listen(3001, () => console.log('listening on port 3001'));
	});
