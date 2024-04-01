import AbstractComponent from "./AbstractComponent.js";
import init from "../games/local_pong.js"

import animateGame from "../utils/animateGameModule.js";

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
		<button type="button" class="btn btn-primary" id="goBackButton">돌아가기</button>
		`;
	}

	handleRoute() {
		animateGame.setAnimateOff();
		const goBackButton = document.querySelector("#goBackButton");
		goBackButton.addEventListener("click", event => {
			window.history.back();
		});
		init();
	}
}

