import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("MyPage");
	}

	async getHtml() {
		return `
		<h1>My Page</h1>
		<p>This is My Page.</p>
		`;
	}
}