import { AppAPI } from './components/AppAPI';
import { AppData, ProductItem } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import { Card, CardBasket, CardPreview } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { OrderAdress, OrderContacts } from './components/Order';
import { Page } from './components/Page';
import './scss/styles.scss';
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

// логика приложения
events.on('catalog:loaded', () => {
	page.catalog = appData.catalog.map(item => {
		console.log(item);
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

events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
})

events.on('preview:changed', (item: ProductItem) => {
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate),
		{ onClick: () => events.emit('card:add', item) });

	modal.render({
		content: cardPreview.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
		})
	})
})

events.on('card:select',(item: ProductItem) => {
	appData.setPreview(item);
})

events.on("order:open", () => {
	basket.setDisabled(basket._submitButton, appData.getStatusBasket());
	basket.total = appData.getTotal();
	let count = 1;
	basket.items = appData.basket.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate),
			{ onClick: () => events.emit('card:remove', item) });
		return card.render({
			title: item.title,
			price: item.price,
			index: count++
		});
	})

	modal.render({
		content: basket.render()
	})

})

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});
