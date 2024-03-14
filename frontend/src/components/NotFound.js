import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("NotFound");
	}

	async getHtml() {
		return `
		<p>404 Not Found!</p>
		`;
	}
}