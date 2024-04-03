import AbstractComponent from "./AbstractComponent.js";
import {init as basicPong} from "../games/localPongBasic.js"
import {init as multiplePong} from "../games/localPongMultify.js"

import animateGame from "../utils/animateGameModule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Local");
	}

	async getHtml() {
		return `
		<div class="selecter">
			<h1>Local Pong Game</h1>
			<p>please, select the mode</p>
		</div>
		<button type="button" class="btn btn-primary" id="basicPongButton">BASIC</button>
		<button type="button" class="btn btn-primary" id="multiplePongButton">MULTIPLE</button>
		<button type="button" class="btn btn-primary" id="goBackButton">돌아가기</button>
		`;
	}

	handleRoute() {
		animateGame.setAnimateOff();
		const selecterDiv = document.querySelector(".selecter");
		const basicPongButton = document.querySelector("#basicPongButton");
		basicPongButton.addEventListener("click", event => {
			selecterDiv.innerHTML = `<h1>Basi Pong</h1>
			<h3 id="scoreBoard"></h3>
		   <div id="container"></div>`;
			basicPong();
		});
		const multiplePongButton = document.querySelector("#multiplePongButton");
		multiplePongButton.addEventListener("click", event => {
			selecterDiv.innerHTML = `<h1>Multiple Pong</h1>
			<h3 id="scoreBoard"></h3>
		   <div id="container"></div>`;
		   multiplePong();
		});
		const goBackButton = document.querySelector("#goBackButton");
		goBackButton.addEventListener("click", event => {
			window.history.back();
		});
		init();
	}
}

