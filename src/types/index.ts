//Отразить типы в этой папке
//описание этих типов вместе с документацией и будет первым шагом
// Описание

/* 1.Типов данных с которыми будете работать в приложении. Как минимум у вас
 должны быть описаны объекты приходящие к вам через API и объекты выводимые на экране. 
	 2.Ваши модели в итоге должны будут трансформировать один тип в другой.
	 3.Интерфейс API-клиента
	 4.Интерфейсы модели данных
	 5.Интерфейсы отображений
	 6.Интерфейсы базовых классов
	 7.Перечисление событий и их интерфейсы (если используете брокер)
	 8.Любые другие типы и интерфейсы если вы заложили их в архитектуру */


//Описывает данные карточки 
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//Описывает данные покупки 
export interface IBuyDetails {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// интерфейс для вывода массива карточек на страницу
export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	getCard(cardId: string): ICard;
}

//интерфейс для работы с формой заказа
export interface IOrderInfo{
	//submitButton: HTMLButtonElement;
	getOrderInfo():TModalOrderInfo;
	setOrderInfo(orderData:TModalOrderInfo):void;
	checkUserValidation(data: Record<keyof TModalOrderInfo, string>): boolean;
}

//интерфейс для работы с формой данных заказчика
export interface ICastomerInfo{
	//submitButton: HTMLButtonElement;
	getCastomerInfo():TModalCastomerInfo;
	setCastomerInfo(orderData:TModalCastomerInfo):void;
	checkUserValidation(data: Record<keyof TModalCastomerInfo, string>): boolean;
}

//Тип данных используемый на главной странице
export type TPublicInfo = Pick<ICard, 'id' | 'image' | 'title' | 'category' | 'price'>;

//Тип данных используемый в модальном окне Способ оплаты, Адрес
export type TModalOrderInfo = Pick<IBuyDetails, 'payment' | 'address'>;

//Тип данных используемый в модальном окне Почта, Телефон
export type TModalCastomerInfo = Pick<IBuyDetails, 'email' | 'phone'>;

//Тип данных используемый в модальном окне Успешная оплата
export type TModalBuySuccess = Pick<IBuyDetails, 'total'>;

//Тип данных используемый в модальном окне Корзины
export type TModalBasket = Pick<ICard, 'id' | 'title' | 'price'>;

//Как сюда запихнуть общую стоимость????


//Тип данных используемый в модальном окне самой Карточки
//export type TModalCard = ICard;