import { Button, message } from 'antd'
import axios from 'axios'

import {
  PRODUCT_COVER_WIDTH,
  PRODUCT_COVER_HEIGHT,
  UPDATE_BASKET_PRODUCTS,
  ADD_ONE_IN_BASKET,
  EMITTER
} from '../constants'

export default class ProductItem extends React.PureComponent {
  addToBasket = async (product) => {
    try {
      await axios.post('http://localhost:3001/basket', {
        type: ADD_ONE_IN_BASKET,
        product
      });
      EMITTER.emit(UPDATE_BASKET_PRODUCTS)
      message.success(`New product : ${product.name} added`);
    } catch (e) {
      message.error('Unable to add product in basket');
    }
  }

  render() {
    const inStock = this.props.quantity > 0;
    const coverClassName = inStock ? 'productCover' : 'productCoverSoldOut';
    const coverUrl = !inStock ? (
      `${this.props.cover}/${PRODUCT_COVER_WIDTH}/${PRODUCT_COVER_HEIGHT}/?blur`
    ) : `${this.props.cover}/${PRODUCT_COVER_WIDTH}/${PRODUCT_COVER_HEIGHT}`;

    return (
      <div className='productContainer'>
        <div className='coverContainer'>
          <img className={coverClassName} src={coverUrl} />
          {!inStock ? (
            <span className='soldOut'>sold out</span>
          ) : null }
        </div>
        <p className='productName'>{this.props.name}</p>
        <p className='categoryName'>{this.props.category}</p>
        <p className='priceContainer'>
          {inStock ? (
            <React.Fragment>
              <span className='price'>£{this.props.price}</span> {this.props.oldPrice ? <span className='oldPrice'>£{this.props.oldPrice}</span> : null}
            </React.Fragment>
          ) : <span className='price'>£{this.props.price}</span> }
        </p>
        {inStock ? (
          <p className='addBasketButton'>
            <Button
              type="primary"
              type="plus"
              size='large'
              onClick={() => this.addToBasket(this.props)}
            >
              Add to basket
            </Button>
          </p>
        ) : null }
        <style jsx>{`
          .productContainer {
            // width: ${PRODUCT_COVER_WIDTH}px;
            margin: 5px;
          }

          .coverContainer {
            position: relative;
          }

          .productName {
            text-align: center;
            padding: 10px 0;
            margin: 0px
          }

          .categoryName {
            text-align: center;
            padding-bottom: 10px;
            margin: 0px
          }

          .priceContainer {
            text-align: center;
          }

          .price {
            font-weight: bold;
          }

          .oldPrice {
            text-decoration: line-through;
          }

          .soldOut {
            color: red;
            font-weight: bold;
            text-transformation: uppercase;
            font-size: 1.5em;
            padding: 10px;
            border: 3px solid;
            position: absolute;
            left: calc(${PRODUCT_COVER_WIDTH}px/3);
            top: calc(${PRODUCT_COVER_HEIGHT}px/2.5);
          }

          .addBasketButton {
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}