import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Main");
	}

	async getHtml(loginModule) {
		loginModule.isLogin();
		return `
		<h1>Welcome!</h1>
		<p>This is Main page.</p>
		<button class="btn btn-outline-primary" data-href="/local">LOCAL</button>
		<button class="btn btn-outline-primary" data-href="/lobby">ONLINE</button>
		`;
	}
}