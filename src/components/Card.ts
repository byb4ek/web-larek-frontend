import { IProductItem } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface ICardsContainer {
    catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
    protected _catalog: HTMLElement;
    

    constructor(protected container: HTMLElement) {
        super(container)
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}


export class Product extends Component<IProductItem> {

	protected events: IEvents;
	protected productImage: HTMLDivElement;
	protected productButton: HTMLButtonElement;
	protected productTitle: HTMLElement;
	protected productId: string;
	protected productDescription: HTMLElement;
	protected productCategory: HTMLElement;
	protected productPrice: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);

		this.events = events;
		
		this.productButton = document.querySelector('.gallery__item');
		this.productCategory = document.querySelector('.card__category');
		this.productTitle = document.querySelector('.card__title');
		this.productImage = document.querySelector('.card__image');
		this.productPrice = document.querySelector('.card__price');
		this.productDescription = document.querySelector('.card__text');


		this.productButton.addEventListener("click",()=>{
			this.events.emit("card:selected",{product:this})
		})
	}
	set id(id: string) {
		this.productId = id;
	};

	get id() {
		return this.productId;
	};

	set title(title: string) {
		this.productTitle.textContent = title;
	};

	set category(category: string) {
		this.productCategory.textContent = category;
	};
	set image(image: string) {
		this.productImage.style.backgroundImage = `url(${image})`;
	};

	set price(price: number | null) {
		if (price === null) this.productPrice.textContent = `Бесценно`;
		this.productPrice.textContent = `${price} синапсов`;
	}

	render(productData: Partial<IProductItem> | undefined) {
		if (!productData) return this.container;
	}
}