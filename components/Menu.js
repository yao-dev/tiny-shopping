/** @format */

import { Menu } from 'antd';
import jsonp from 'jsonp';

import Basket from './Basket';
import {
	UPDATE_BASKET_PRODUCTS,
	SHOW_BASKET,
	ALL_PRODUCT,
	SELECT_CATEGORY,
	CATEGORY_WOMEN_FOOTWEAR,
	CATEGORY_WOMEN_CASUALWEAR,
	CATEGORY_WOMEN_FORMALWEAR,
	CATEGORY_MEN_FOOTWEAR,
	CATEGORY_MEN_CASUALWEAR,
	CATEGORY_MEN_FORMALWEAR,
	EMITTER,
} from '../constants';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			basket: {},
			basketVisible: false,
		};
	}

	componentDidMount() {
		EMITTER.addListener(UPDATE_BASKET_PRODUCTS, this.getBasket);
		this.getBasket();
	}

	getBasket = () => {
		jsonp('http://localhost:3001/basket', null, (err, response) => {
			if (!err) {
				return this.setState({ basket: response });
			}
		});
	};

	handleClick = (key) => {
		switch (key) {
			case SHOW_BASKET:
				return this.showBasket();
			case ALL_PRODUCT:
				return EMITTER.emit(SELECT_CATEGORY, ALL_PRODUCT);
			case CATEGORY_WOMEN_FOOTWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_WOMEN_FOOTWEAR);
			case CATEGORY_WOMEN_CASUALWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_WOMEN_CASUALWEAR);
			case CATEGORY_WOMEN_FORMALWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_WOMEN_FORMALWEAR);
			case CATEGORY_MEN_FOOTWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_MEN_FOOTWEAR);
			case CATEGORY_MEN_CASUALWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_MEN_CASUALWEAR);
			case CATEGORY_MEN_FORMALWEAR:
				return EMITTER.emit(SELECT_CATEGORY, CATEGORY_MEN_FORMALWEAR);
		}
	};

	showBasket = () => {
		this.setState({
			basketVisible: true,
		});
	};

	closeBasket = () => {
		this.setState({
			basketVisible: false,
		});
	};

	render() {
		return (
			<React.Fragment>
				<Menu style={{ width: 1440 }} mode="horizontal">
					<Menu.Item
						key={ALL_PRODUCT}
						onClick={() => this.handleClick(ALL_PRODUCT)}
					>
						<strong>Tiny Shopping</strong>
					</Menu.Item>
					<Menu.SubMenu
						key="sub1"
						title={
							<span>
								<span>Women</span>
							</span>
						}
					>
						<Menu.Item
							key={CATEGORY_WOMEN_FOOTWEAR}
							onClick={() => this.handleClick(CATEGORY_WOMEN_FOOTWEAR)}
						>
							Footwear
						</Menu.Item>
						<Menu.Item
							key={CATEGORY_WOMEN_CASUALWEAR}
							onClick={() => this.handleClick(CATEGORY_WOMEN_CASUALWEAR)}
						>
							Casualwear
						</Menu.Item>
						<Menu.Item
							key={CATEGORY_WOMEN_FORMALWEAR}
							onClick={() => this.handleClick(CATEGORY_WOMEN_FORMALWEAR)}
						>
							Formalwear
						</Menu.Item>
					</Menu.SubMenu>
					<Menu.SubMenu
						key="sub2"
						title={
							<span>
								<span>Men</span>
							</span>
						}
					>
						<Menu.Item
							key={CATEGORY_MEN_FOOTWEAR}
							onClick={() => this.handleClick(CATEGORY_MEN_FOOTWEAR)}
						>
							Footwear
						</Menu.Item>
						<Menu.Item
							key={CATEGORY_MEN_CASUALWEAR}
							onClick={() => this.handleClick(CATEGORY_MEN_CASUALWEAR)}
						>
							Casualwear
						</Menu.Item>
						<Menu.Item
							key={CATEGORY_MEN_FORMALWEAR}
							onClick={() => this.handleClick(CATEGORY_MEN_FORMALWEAR)}
						>
							Formalwear
						</Menu.Item>
					</Menu.SubMenu>
					<Menu.Item
						key={SHOW_BASKET}
						onClick={() => this.handleClick(SHOW_BASKET)}
					>
						My basket{' '}
						{this.state.basket.productsCount ? (
							<span id="basketItemNumber">
								{this.state.basket.productsCount}
							</span>
						) : null}
					</Menu.Item>
				</Menu>
				<Basket
					visible={this.state.basketVisible}
					closeBasket={this.closeBasket}
				/>
				<style>{`
          #basketItemNumber {
            color: #FFF;
            background: red;
            padding: 5px;
          }
        `}</style>
			</React.Fragment>
		);
	}
}
