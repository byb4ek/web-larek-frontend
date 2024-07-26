import { FormErrors, IProductItem } from './../types/index';
import { IAppDate, IOrder } from "../types/index";
import { Component } from "./base/Component";
import { Model } from "./base/Model";
import { ProductItem } from "./ProductItem";

export class Product extends Model<IProductItem> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export class AppData extends Model<IAppDate> {
	catalog: Product[];
	preview: string;
	basket: Product[] = [];
	order: IOrder = {
		payment: 'card',
		address: '',
		phone: '',
		email: '',
		total: 0,
		items: []
	};
	formErrors: FormErrors = {};

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => {
			return new Product(item, this.events)
		})
		this.events.emit('catalog:loaded', this.catalog)
	}
	setPreview() {
		this.preview
	}
	setProductToBasket(item: Product) {
		this.basket.push(item)
	}
	set Total(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce((acc, item) =>acc + this.catalog.find((product) => product.id === item).price, 0)
	}
	setOrderAddress() {
		
	}
	setOrderContacts() {

	}

	getBasket() {

	}
	getStatusBasket() {

	}
	addProductToOrder() {

	}
	removeProductFromOrder() {

	}
	clearBasket() {

	}
	validationOrderAddress() {

	}
	validationOrderContacts() {
	}

}