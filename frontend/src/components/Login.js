import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js"
import {DOMAIN, DOMAIN_NAME} from "../index.js";

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
				const response = await fetchModule.request(new Request(`${DOMAIN_NAME}/user/status-update/`, {
					method: 'POST',
					credentials: "include",
				}));
				if (response.ok)
					location.href = "/";
				else
					throw new Error(response.statusText);
			} catch (error) {
				location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a44af88cc4ff0433fc32ca3cc93bc26a96ced1a9b0a7c5293de5fb6418ab5707&redirect_uri=https%3A%2F%2F${DOMAIN}%2Flogin%2Foauth&response_type=code`;
			}
		})
	}
}