import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js"
import {BACKEND_URL, DOMAIN_NAME, OAUTH_CLIENT, navigateTo} from "../index.js";

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
				location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${OAUTH_CLIENT}&redirect_uri=https://${DOMAIN_NAME}/login/oauth&response_type=code`;
			}
		})
	}
}