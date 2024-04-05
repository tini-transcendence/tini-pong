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
		<style>
		body {
			background-image: url("./src/img/Login_Background.png");
			background-repeat: no-repeat;
			background-attachment: fixed;
			background-size: cover;
			background-position: center;
		}
		</style>
		<div class="d-flex flex-column justify-content-center align-items-start" style="min-height: 100dvh; margin-left: 18dvw;">
			<div class="text-start noto-sans white-blue lobby-title">TINY<br />PING<br />PONG</div>
			<div class="mt-5">
				<button class="btn btn-outline-light btn-lg noto-sans lobby-btn">&nbsp&nbsp&nbspLOG IN&nbsp&nbsp&nbsp</button>
			</div>
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
				location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a44af88cc4ff0433fc32ca3cc93bc26a96ced1a9b0a7c5293de5fb6418ab5707&redirect_uri=https%3A%2F%2F${DOMAIN_NAME}%2Flogin%2Foauth&response_type=code`;
			}
		})
	}
}