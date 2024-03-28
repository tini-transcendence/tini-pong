import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Login oauth");
	}

	async getHtml() {
		return `
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		`;
	}

	handleRoute() {
		const queryString = location.search;

		(async function() {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request(`http://localhost:8000/user/login/oauth${queryString}`, {
					method: 'GET',
					credentials: "include"
				}));
				if (response.ok) {
					const data = await response.json();
					localStorage.setItem("refresh_token", data.refresh_token);
					location.href = "/";
				}
				else
					throw new Error(response.statusText);
			} catch (error) {
				console.log(error.message);
			}
		})();
	}
}