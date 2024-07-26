import { AppAPI } from './components/AppAPI';
import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки

events.onAll(({eventName, data}) => {
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