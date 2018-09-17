/** @format */

import { Modal, Button, Input, message } from 'antd';
import axios from 'axios';
import jsonp from 'jsonp';

import {
	PRODUCT_COVER_WIDTH,
	PRODUCT_COVER_HEIGHT,
	ADD_ONE_IN_BASKET,
	UPDATE_BASKET_PRODUCTS,
	REMOVE_ONE_IN_BASKET,
	REMOVE_PRODUCT,
	INVALID_VOUCHER,
	VOUCHER_ON_EMPTY_BASKET,
	VOUCHER_ALREADY_APPLIED,
	EMITTER,
} from '../constants';

export default class Basket extends React.Component {
	state = {
		visible: false,
		products: [],
		basket: {
			productsCount: 0,
			products: [],
		},
		voucher: '',
	};

	componentDidMount() {
		EMITTER.addListener(UPDATE_BASKET_PRODUCTS, this.getProducts);
		EMITTER.addListener(UPDATE_BASKET_PRODUCTS, this.getBasket);
		this.getProducts();
		this.getBasket();
	}

	componentWillReceiveProps(nextProps) {
		return this.setState({ visible: nextProps.visible });
	}

	getProducts = () => {
		jsonp('http://localhost:3001/products', null, (err, response) => {
			if (!err) {
				return this.setState({ products: response });
			}
		});
	};

	getBasket = () => {
		jsonp('http://localhost:3001/basket', null, (err, response) => {
			if (!err) {
				return this.setState({ basket: response });
			}
		});
	};

	handleOk = (e) => {
		this.setState({ visible: false });
		this.props.closeBasket();
	};

	handleCancel = (e) => {
		this.setState({ visible: false });
		this.props.closeBasket();
	};

	addOneInBasket = async (product) => {
		try {
			await axios.post('http://localhost:3001/basket', {
				type: ADD_ONE_IN_BASKET,
				product,
			});
			EMITTER.emit(UPDATE_BASKET_PRODUCTS);
		} catch (e) {
			this.addOneInBasket(product);
		}
	};

	removeOneInBasket = async (product) => {
		try {
			await axios.post('http://localhost:3001/basket', {
				type: REMOVE_ONE_IN_BASKET,
				product,
			});
			EMITTER.emit(UPDATE_BASKET_PRODUCTS);
		} catch (e) {
			this.removeOneInBasket(product);
		}
	};

	removeProduct = async (product) => {
		try {
			await axios.post('http://localhost:3001/basket', {
				type: REMOVE_PRODUCT,
				product,
			});
			EMITTER.emit(UPDATE_BASKET_PRODUCTS);
		} catch (e) {
			this.removeProduct(product);
		}
	};

	handleVoucher = (e) => {
		const voucher = e.target.value;
		this.setState({ voucher });
	};

	validVoucher = async () => {
		try {
			await axios.post('http://localhost:3001/vouchers', {
				voucher: this.state.voucher,
			});
			message.success('Voucher has been applied');
			EMITTER.emit(UPDATE_BASKET_PRODUCTS);
		} catch (e) {
			switch (e.response.data) {
				case INVALID_VOUCHER:
					return message.error('Voucher is invalid');
				case VOUCHER_ON_EMPTY_BASKET:
					return message.error(`You can't apply on a empty basket`);
				case VOUCHER_ALREADY_APPLIED:
					return message.error(`This voucher is already applied`);
			}
		}
		return this.setState({ voucher: '' });
	};

	buyNow = async () => {
		try {
			await axios.post('http://localhost:3001/buy');
			this.setState({ visible: false });
			message.success('Thank you for your purchase');
			EMITTER.emit(UPDATE_BASKET_PRODUCTS);
		} catch (e) {
			message.error('Unable to proceed to payment');
		}
	};

	render() {
		return (
			<Modal
				onCancel={this.handleCancel}
				onOk={this.handleOk}
				visible={this.props.visible}
				closable={true}
				title={
					<span>
						My basket -{' '}
						<span id="basketItemNumber">{this.state.basket.productsCount}</span>
					</span>
				}
				footer={[
					<Input
						key="voucher"
						placeholder="Enter a voucher"
						style={{ width: 150, maxWidth: 150, marginRight: 10 }}
						onChange={this.handleVoucher}
					/>,
					<Button
						key="applyVoucher"
						onClick={this.validVoucher}
						disabled={!this.state.basket.productsCount ? true : false}
					>
						Apply
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={this.buyNow}
						disabled={!this.state.basket.productsCount ? true : false}
					>
						Buy now{' '}
						{this.state.basket.totalWithVoucher ? (
							<React.Fragment>
								£{this.state.basket.totalWithVoucher}{' '}
								<span className="oldPrice">£{this.state.basket.total}</span>
							</React.Fragment>
						) : (
							this.state.basket.total
						)}
					</Button>,
				]}
			>
				<React.Fragment>
					<p style={{ fontWeight: 'bold', textAlign: 'center' }}>
						* The vouchers are not combinable
					</p>
					<div>
						{this.state.basket.products.map((item) => {
							const product = this.state.products.find(
								(product) => product.id === item.id
							);

							if (!product) return null;

							return (
								<React.Fragment key={item.id}>
									<div>
										<div>
											<div>
												<img
													width="50"
													height="50"
													src={`${
														item.cover
													}/${PRODUCT_COVER_WIDTH}/${PRODUCT_COVER_HEIGHT}`}
												/>
											</div>
											<div>
												<p>£{item.price}</p>
												<p>{item.name}</p>
												<p>{item.category}</p>
												<div>
													<span>Quantity: {item.quantity}</span>
													<Button
														type="primary"
														shape="circle"
														icon="plus"
														disabled={product.quantity < 1 ? true : false}
														onClick={() => this.addOneInBasket(item)}
													/>
													<Button
														type="primary"
														shape="circle"
														icon="minus"
														disabled={item.quantity === 0 ? true : false}
														onClick={() => this.removeOneInBasket(item)}
													/>
													<Button onClick={() => this.removeProduct(item)}>
														Remove product
													</Button>
												</div>
											</div>
										</div>
										<div>
											<span>Sub-total: £{item.totalPrice}</span>
										</div>
									</div>
								</React.Fragment>
							);
						})}
					</div>
				</React.Fragment>
				<style jsx>{`
					.oldPrice {
						text-decoration: line-through;
					}
				`}</style>
			</Modal>
		);
	}
}
