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
		const multiplePongButton = document.querySelector("#multiplePongButton");
		const goBackButton = document.querySelector("#goBackButton");

		basicPongButton.addEventListener("click", async event => {
			selecterDiv.innerHTML = `<h1>Basi Pong</h1>
			<h3 id="scoreBoardB"></h3>
		   <div id="containerB"></div>`;
			basicPongButton.style.display = 'none';
			multiplePongButton.style.display = 'inline';
			animateGame.setAnimateOff();
			basicPong();
		});
		multiplePongButton.addEventListener("click", async event => {
			selecterDiv.innerHTML = `<h1>Multiple Pong</h1>
			<h3 id="scoreBoardM"></h3>
			<div id="containerM"></div>`;
			basicPongButton.style.display = 'inline';
			multiplePongButton.style.display = 'none';
			animateGame.setAnimateOff();
			multiplePong();
		});
		goBackButton.addEventListener("click", event => {
			window.history.back();
		});
	}
}

