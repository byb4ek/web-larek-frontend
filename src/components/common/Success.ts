import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ISuccess {
	total: string | number;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

		this._close.addEventListener('click', () => {
			this.events.emit('order:completed');
		})
	}

	set total(total: string | number) {
		this._total.textContent = `Списано ${total} синапсов`;
	}
}