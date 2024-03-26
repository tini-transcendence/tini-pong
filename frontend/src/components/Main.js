import AbstractComponent from "./AbstractComponent.js";
import LoginModule from "../utils/loginmodule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Main");
	}

	async getHtml() {
		const loginModule = new LoginModule();
		loginModule.isLogin();
		return `
		<h1>Welcome!</h1>
		<p>This is Main page.</p>
		<button class="btn btn-outline-primary" data-href="/local">LOCAL</button>
		<button class="btn btn-outline-primary" data-href="/lobby">ONLINE</button>
		`;
	}
}