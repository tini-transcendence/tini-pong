import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js"
import {DOMAIN} from "../index.js";

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
			const refreshToken = localStorage.getItem("refresh_token");
			if (refreshToken) // refresh token이 존재, accecc token 유무 구분해야함
			{
				try {
					const fetchModule = new FetchModule();
					await fetchModule.getReIssuedAccessToken(refreshToken);
					location.href = "/";
				} catch (error) {
					location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-88f8f80ad20a658e0f48b6931617a4491ce213918172eea5f8d51676d4f9210d&redirect_uri=https%3A%2F%2F${DOMAIN}%2Flogin%2Foauth&response_type=code`;
				}
			}
			else // refresh token 만료
				location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-88f8f80ad20a658e0f48b6931617a4491ce213918172eea5f8d51676d4f9210d&redirect_uri=https%3A%2F%2F${DOMAIN}%2Flogin%2Foauth&response_type=code`;
		})
	}
}