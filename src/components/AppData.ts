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
	}
	setPreview() {

	}
	setProductToBasket() {

	}
	setTotal() {

	}
	setOrderAddress() {

	}
	setOrderContacts() {

	}
	getTotal() {

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