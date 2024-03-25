import AbstractComponent from "./AbstractComponent.js";
import init from "../games/local_pong.js"

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Local");
	}

	async getHtml() {
		return `
		<h1>Pong</h1>
 		<h3 id="scoreBoard"></h3>
    	<div id="container"></div>
		`;
	}

	handleRoute() {
		init();
	}
}

