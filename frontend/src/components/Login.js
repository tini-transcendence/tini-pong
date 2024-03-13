import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Login");
	}

	async getHtml() {
		return `
		<h1 class="display-1 text-center">TITLE</h1>
		<div class="d-flex justify-content-center">
			<button class="btn btn-outline-primary btn-lg" data-href="/">LOG IN</button>
		</div>
		`;
	}
}