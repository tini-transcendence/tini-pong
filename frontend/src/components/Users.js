import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Users");
	}

	async getHtml(params) {
		const username = params.username;
		return `
		<h1>${username} Page</h1>
		<p>This is ${username} Page.</p>
		`;
	}
}