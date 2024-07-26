import { IOrder, IOrderResult, IProductItem } from "../types";
import { Api, ApiListResponse } from "./base/Api";

//Класс API
export class AppAPI extends Api {
	readonly api: Api;
	constructor(api: Api, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.api = api;
	}

	getProductList() {
		return this.get('/product').then((response: ApiListResponse<IProductItem>) => {
			return response.items.map((item) => {
				return { ...item };
			})
		})
	};

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((response: IOrderResult) => response)
	};
}
