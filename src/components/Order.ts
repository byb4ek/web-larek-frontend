import { IOrderForm } from "../types";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { IEvents } from "./base/Events";
import { Form } from "./common/Form";


export class OrderContacts extends Form<IOrderForm> {
	constructor(protected container: HTMLFormElement, event: IEvents) {
		super(container, event);

	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
		//(this.container.querySelector('input[name="phone"]') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}

export class OrderAdress extends Form<IOrderForm> {
	protected _button: HTMLButtonElement[];
	constructor(protected container: HTMLFormElement, event: IEvents) {
		super(container, event);
		this._button = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		this._button.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				event.emit('payment:change', button);
			})
		})
	}


	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}


	set payment(value: string) {
		this._button.forEach(button => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}
}
