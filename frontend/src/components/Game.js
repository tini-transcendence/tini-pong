import AbstractComponent from "./AbstractComponent.js";
import {init as basicPong} from "../games/onlinePongBasic.js"
// import {init as multiplePong} from "../games/onlinePongMultiple.js"
// import {init as tournamentPong} from "../games/onlinePongTournament.js"

import animateGame from "../utils/animateGameModule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Online Pong Game");
	}

	async getHtml() {
		return `
		<h1>Pong</h1>
 		<h3 id="scoreBoard"></h3>
    	<div id="container"></div>
		<div id="tournament_result" style="display: none;">
			<p>Round1 : </p>
			<p>Round2 : </p>
			<p>Final Round : </p>
		</div>
		`;
	}

	handleRoute() {
		animateGame.setAnimateOff();

		// WebSocket이 열려 있는 경우에만 게임을 수행
		if (window.websocket.readyState === WebSocket.OPEN) {
			// 경우 1 : 1 vs 1
			basicPong(3, "nickname 1", "nickname 2");
			// 경우 2 : 2 vs 2
			// 경우 3 : tournament
				// tournament_result의 display속성을 block으로 변경
			console.log("Web socket이 살아있어요!");
		}
		else
		{
			// 강제로 main이나 lobby로 보내기
			// window.history.back();
			console.log("Web socket이 죽어있어요!");
		}
	}
}

