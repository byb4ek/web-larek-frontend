import { IProductItem } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}
//onClick нужен для того чтобы в index.ts сделать действие, что то типа колбека 


export interface ICard {
	title: string;
	category: string;
	image: string;
	price: number;
	text: string;
}

export interface ICardDescription {
	description: HTMLElement;
}

export interface ICardBasket {
	index: number,
	title: string,
	price: number,
}

export class Card<T> extends Component<ICard> {
	protected events: IEvents;
	protected _image: HTMLImageElement;
	protected _category: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _colorCategory: HTMLElement;

	constructor(protected container: HTMLElement, actions?: ICardAction) {
		super(container);

		this._category = document.querySelector('.card__category');
		this._colorCategory = document.querySelector('.card__category');
		this._title = document.querySelector('.card__title');
		this._image = document.querySelector('.card__image');
		this._price = document.querySelector('.card__price');

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(title: string) {
		this._title.textContent = title;
	};

	set category(category: string) {
		this._category.textContent = category;
	};
	set image(image: string) {
		this._image.style.backgroundImage = `url(${image})`;
	};

	set price(price: number | null) {
		if (price === null) this._price.textContent = `Бесценно`;
		this._price.textContent = `${price} синапсов`;
	}

	set colorCategory(color: string) {
		//this._colorCategory.textContent = color;
	};

	render(productData: Partial<IProductItem> | undefined) {
		if (!productData) return this.container;
	}
}

export class CardPreview extends Card<ICardDescription> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container, actions);

		this._button = document.querySelector(".card__button");
		this._description = document.querySelector('.card__text');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}
}

export class CardBasket extends Component<ICardBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container);
		this._index = document.querySelector('.basket__item-index');
		this._title = document.querySelector('.card__title');
		this._price = document.querySelector('.card__price');
		this._button = document.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}

	}
	set index(value: number) {
		this.setText(this._index, String(value));
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this._price.textContent = `Бесценно`;
		}
		this._price.textContent = `${value} синапсов`;

	}
}
