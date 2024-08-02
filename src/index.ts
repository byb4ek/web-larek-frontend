import { AppAPI } from './components/AppAPI';
import { AppData, } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import { Card, CardBasket, CardPreview } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { OrderAdress, OrderContacts } from './components/Order';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IOrderForm, IProductItem } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

//Шаблоны приложения
const modalSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalBasketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const modalOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const modalContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppData({}, events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Переиспользуемые части интерфейса приложения
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(modalBasketTemplate), events);
const orderAdress = new OrderAdress(cloneTemplate<HTMLFormElement>(modalOrderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate<HTMLFormElement>(modalContactsTemplate), events);
const success = new Success(cloneTemplate<HTMLFormElement>(modalSuccessTemplate), events);


//Бизнес логика приложения
events.on('catalog:loaded', () => {
	page.catalog = appData.catalog.map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate),
			{ onClick: () => events.emit('card:select', item) });
		return card.render({
			title: item.title,
			category: item.category,
			image: api.api + item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => { events.emit('card:add', item); }
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: api.api + item.image,
			category: item.category,
			price: item.price,
			description: item.description,
		})
	})

	if (item.price === null) {
		card.activeButton = true;
	}

});

events.on('card:add', (item: IProductItem) => {
	appData.addProductToOrder(item);
	appData.setProductToBasket(item);
	events.emit('basket:change');
	modal.close();
})

events.on('basket:open', () => {
	modal.render({
		content: basket.render()
	});
});

events.on('card:remove', (item: IProductItem) => {
	console.log("test")
	appData.removeProductFromOrder(item);
	appData.removeProductFromBasket(item);
	events.emit('basket:change');
})

events.on('basket:change', () => {
	basket.setDisabled(basket._submitButton, appData.getStatusBasket());
	page.counter = appData.basket.length;
	basket.total = appData.getTotal();
	let count = 1;
	basket.items = appData.basket.map(item => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => { events.emit('card:remove', item); }
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: count++,
		});
	});
	basket.render();
});

events.on('formError:changed', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderAdress.valid = !address && !payment;
	orderContacts.valid = !email && !phone;
	orderAdress.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
	orderContacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderContacts(data.field, data.value);
});

events.on(/^order\..*/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderAddress(data.field, data.value);
});

events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
})

events.on('order:open', () => {
	modal.render({
		content: orderAdress.render({
			address: '',
			payment: 'card',
			valid: false,
			errors: []
		})
	});
});

events.on('order:submit', () => {
	appData.order.total = appData.getTotal()
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: []
		})
	});
})

events.on('contacts:submit', () => {
	api.orderProducts(appData.order)
		.then((result) => {
			modal.render({
				content: success.render({
					total: appData.getTotal(),
				})
			})
			appData.clearBasket();
			events.emit('basket:change');
		});
})

events.on('order:completed', () => {
	modal.close();
	appData.clearBasket();
	events.emit('basket:change');
})

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:success', () => {
	events.emit("order:completed");
})

api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});