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

//Бизнес логика приложения
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
