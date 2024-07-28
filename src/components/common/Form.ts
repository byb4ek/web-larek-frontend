import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IForm {
	errors: string[],
	valid: boolean
}

export class Form<T> extends Component<IForm> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected evt: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.evt.emit(`${this.container.name}:submit`);
	});
	}


	protected onInputChange(field: keyof T, value: string) {
		this.evt.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;

	}
}