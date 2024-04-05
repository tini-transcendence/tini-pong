import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js"
import {BACKEND_URL, DOMAIN_NAME, navigateTo} from "../index.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Login");
	}

	async getHtml() {
		return `
		<h1 class="display-1 text-center">TITLE</h1>
		<div class="d-flex justify-content-center">
			<button class="btn btn-outline-primary btn-lg">LOG IN</button>
		</div>
		`;
	}

	handleRoute() {
		const appNode = document.querySelector("#app");
		const loginBtn = appNode.querySelector(".btn");
		loginBtn.addEventListener("click", async event => {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request(`${BACKEND_URL}/user/status-update/`, {
					method: 'POST',
					credentials: "include",
				}));
				if (response.ok)
					navigateTo("/");
				else
					throw new Error(response.statusText);
			} catch (error) {
				location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-88f8f80ad20a658e0f48b6931617a4491ce213918172eea5f8d51676d4f9210d&redirect_uri=https%3A%2F%2F${DOMAIN_NAME}%2Flogin%2Foauth&response_type=code`;
			}
		})
	}
}