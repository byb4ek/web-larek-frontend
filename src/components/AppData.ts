import { FormErrors, IOrderForm, IProductItem } from './../types/index';
import { IAppDate, IOrder } from "../types/index";
import { Model } from "./base/Model";

export class AppData extends Model<IAppDate> {
	catalog: IProductItem[];
	preview: string;
	basket: IProductItem[] = [];
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

			return item;
		})
		this.events.emit('catalog:loaded', this.catalog)
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setProductToBasket(item: IProductItem) {
		this.basket.push(item)
	}

	setTotal(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce((acc, item) => acc + this.catalog.find((product) => product.id === item).price, 0)
	}

	getBasket(): IProductItem[] {
		return this.basket
	}

	getStatusBasket(): boolean {
		return this.basket.length === 0
	}

	addProductToOrder(item: IProductItem) {
		this.order.items.push(item.id)
	}

	removeProductFromOrder(item: IProductItem) {
		const index = this.order.items.indexOf(item.id);
    if (index >= 0) {
      this.order.items.splice( index, 1 );
    }
	}

	removeProductFromBasket(item: IProductItem) {
		const index = this.basket.indexOf(item);
    if (index >= 0) {
      this.basket.splice( index, 1 );
    }
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