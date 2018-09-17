import EventEmitter from 'wolfy87-eventemitter';

export const EMITTER = new EventEmitter();

export const ALL_PRODUCT = 'ALL_PRODUCT';

export const CATEGORY_WOMEN_FOOTWEAR = `Women’s Footwear`;
export const CATEGORY_WOMEN_CASUALWEAR = `Women’s Casualwear`;
export const CATEGORY_WOMEN_FORMALWEAR = `Women’s Formalwear`;

export const CATEGORY_MEN_FOOTWEAR = `Men’s Footwear`;
export const CATEGORY_MEN_CASUALWEAR = `Men’s Casualwear`;
export const CATEGORY_MEN_FORMALWEAR = `Men’s Formalwear`;

export const PRODUCT_COVER_WIDTH = '315';
export const PRODUCT_COVER_HEIGHT = '405';

export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const NEW_PRODUCT_ADDED = 'NEW_PRODUCT_ADDED';
export const SHOW_BASKET = 'SHOW_BASKET';
export const ADD_ONE_IN_BASKET = 'ADD_ONE_IN_BASKET';
export const REMOVE_ONE_IN_BASKET = 'REMOVE_ONE_IN_BASKET';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const REPLACE_PRODUCT_QUANTITY = 'REPLACE_PRODUCT_QUANTITY';
export const UPDATE_BASKET_PRODUCTS = 'UPDATE_BASKET_PRODUCTS';
export const INVALID_VOUCHER = 'INVALID_VOUCHER';
export const VOUCHER_ON_EMPTY_BASKET = 'VOUCHER_ON_EMPTY_BASKET';
export const VOUCHER_ALREADY_APPLIED = 'VOUCHER_ALREADY_APPLIED';