import { FormErrors, IOrderForm, IProductItem } from './../types/index';
import { IAppDate, IOrder } from "../types/index";
import { Model } from "./base/Model";

export class ProductItem extends Model<IProductItem> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export class AppData extends Model<IAppDate> {
	catalog: ProductItem[];
	preview: string | null;
	basket: ProductItem[] = [];
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
			return new ProductItem(item, this.events)
		})
		this.events.emit('catalog:loaded', this.catalog)
	}
	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
	
	setProductToBasket(item: ProductItem) {
		this.basket.push(item)
	}
	setTotal(value: number) {
		this.order.total = value;
	}
	
	getTotal() {
		return this.order.items.reduce((acc, item) => acc + this.catalog.find((product) => product.id === item).price, 0)
	}

	getBasket(): ProductItem[] {
		return this.basket
	}

	getStatusBasket(): boolean {
		return this.basket.length > 0
	}

	addProductToOrder(item: ProductItem) {
		this.order.items.push(item.id)
	}

	removeProductFromOrder(item: ProductItem) {
		this.order.items = this.order.items.filter((id) => id !== item.id)
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}
	
	
	setOrderAddress(item: keyof IOrderForm, value: string) {
		this.order[item] = value;
		if (this.validationOrderAddress()) {
			this.events.emit(`order:ready`, this.order);
		}
	}

	setOrderContacts(item: keyof IOrderForm, value: string) {
		this.order[item] = value;
		if (this.validationOrderContacts()) {
			this.events.emit(`order:ready`, this.order);
		}
	}

	validationOrderAddress() {
		const err: typeof this.formErrors = {};
		if (!this.order.address) {
			err.address = 'Заполните поле адреса';
		}
		if (!this.order.payment) {
			err.payment = 'Заполните поле способа оплаты';
		}

		this.formErrors = err;
		this.events.emit('formError:changed', err)
		return Object.keys(err).length === 0
	}

	validationOrderContacts() {
		const err: typeof this.formErrors = {};
		if (!this.order.email) {
			err.email = 'Заполните поле почты';
		}
		if (!this.order.phone) {
			err.phone = 'Заполните поле номера телефона';
		}

		this.formErrors = err;
		this.events.emit('formError:changed', err)
		return Object.keys(err).length === 0
	}
}