/** @format */

import jsonp from 'jsonp';
import compact from 'lodash/compact';

import ProductItem from './ProductItem';
import {
	ALL_PRODUCT,
	SELECT_CATEGORY,
	EMITTER,
	UPDATE_BASKET_PRODUCTS,
} from '../constants';

export default class ProductList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			products: [],
			category: ALL_PRODUCT,
		};
	}

	componentDidMount() {
		EMITTER.addListener(UPDATE_BASKET_PRODUCTS, this.getProducts);
		EMITTER.addListener(SELECT_CATEGORY, this.showProducts);
		this.getProducts();
	}

	getProducts = () => {
		jsonp('http://localhost:3001/products', null, (err, response) => {
			if (!err) {
				return this.setState({ products: response });
			}
		});
	};

	showProducts = (category) => {
		this.setState({ category });
	};

	render() {
		let productList = null;

		if (this.state.products.length) {
			productList = this.state.products.map((item) => {
				const toShow =
					this.state.category === ALL_PRODUCT ||
					item.category === this.state.category;

				if (!toShow) {
					return false;
				}

				return (
					<ProductItem
						key={item.id}
						id={item.id}
						name={item.name}
						category={item.category}
						price={item.price}
						oldPrice={item.oldPrice}
						quantity={item.quantity}
						cover={item.cover}
					/>
				);
			});
			productList = compact(productList);
		}

		const totalProduct = productList ? productList.length : 0;

		return (
			<div id="productView">
				<p id="totalProduct">{totalProduct} products found</p>
				<div id="productListContainer">{productList}</div>
				<style jsx>{`
					#productView {
						width: 100%;
						margin: 20px 0px;
					}

					#totalProduct {
						text-align: center;
						font-weight: bold;
					}

					#productListContainer {
						margin: auto;
						display: flex;
						flex-flow: row wrap;
						justify-content: center;
						width: 100%;
					}
				`}</style>
			</div>
		);
	}
}
