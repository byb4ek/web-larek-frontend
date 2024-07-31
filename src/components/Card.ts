import { IProductItem } from "../types";
import { ensureElement } from "../utils/utils";
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
	description: string | null;
}

export interface ICardDescription {
	description: string;
}

export interface ICardBasket {
	index: number,
	title: string,
	price: number,
}

export class Card<T> extends Component<ICard> {
	protected events: IEvents;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _categoryColor = <Record<string, string>> {
    "софт-скил": "soft",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
    "хард-скил": "hard"
  }

	constructor(protected container: HTMLElement, actions?: ICardAction) {
		super(container);

		this._category = ensureElement<HTMLElement>(`.card__category`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(title: string) {
		this.setText(this._title, title);
	};

	set category(category: string) {
		this.setText(this._category, category);
    this._category.className = `card__category card__category_${this._categoryColor[category]}`
	};

	set image(image: string) {
		this.setImage(this._image, image, this.title);
	};

	set price(price: number | null) {
		if (price === null) this.setText(this._price, `Бесценно`);
		this.setText(this._price, `${price} синапсов`);
	}

}

export class CardPreview extends Card<ICardDescription> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container, actions);

		this._button = document.querySelector(".card__button");
		this._description = ensureElement<HTMLElement>(`.card__text`, container);

		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: string) {
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

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._button = document.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				container.removeEventListener('click', actions.onClick);
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		}
		this.setText(this._price, `${value} синапсов`);
	}
}
