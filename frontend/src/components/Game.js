import AbstractComponent from "./AbstractComponent.js";
import {init as basicPong} from "../games/onlinePongBasic.js"
import {init as multiplePong} from "../games/onlinePongMultiple.js"
import {init as tournamentPong} from "../games/onlinePongTournament.js"
import {gt, gd, p1, p2, p3, p4} from "./Room.js"
import {navigateTo} from "../index.js";
import animateGame from "../utils/animateGameModule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Online Pong Game");
	}

	async getHtml() {
		return `
		<style>
			div {margin:auto; text-align: center;}
			canvas {align-self: center; margin:auto;}
			#gameHeader { margin-top: 10px; font-size: 30px; border-bottom: solid black 2px; }
			#gameName { font-size: 35px; font-weight: bold; }
			#p1nickBoard { text-align: left; display: none; }
			#scoreBoard { font-size: 30px; text-align: center; }
			#p2nickBoard { text-align: right; display: none; }
		</style>
		<div>
			<div class="container-lg" id="gameHeader">
				<div id="gameName">Basic Pong</div>
				<div class="row" id="scoreLine">
					<div class="col text-left" id="p1nickBoard"></div>
					<div class="col" id="scoreBoard"></div>
					<div class="col text-right" id="p2nickBoard"></div>
				</div>
			</div>
			<div class="container-lg" id="container"></div>
			<div id="tournament_result" style="display: none;"></div>
			<button type="button" class="btn btn-primary" id="goBackButton">돌아가기</button>
		</div>
		`;
	}

	handleRoute() {
		animateGame.setAnimateOff();

		const goBackButton = document.querySelector("#goBackButton");

		// WebSocket이 존재하는가?
		if (window.websocket === undefined)
			navigateTo("/lobby");
		else
		{
			// WebSocket이 열려 있는 경우에만 게임을 수행
			if (window.websocket.readyState === WebSocket.OPEN)
			{
				// 경우 1 : 1 vs 1
				if (gt === 1)
					basicPong(gd, p1, p2);
				//	basicPong(3, "nick1", "nick2");
				// 경우 2 : 2 vs 2
				else if (gt === 2)
					multiplePong(gd, p1, p2, p3, p4);
				//	multiplePong(3, "nick1", "nick2", "nick3", "nick4");
				// 경우 3 : tournament
				else if (gt === 3)
					tournamentPong(gd, p1, p2, p3, p4);
				//	tournamentPong(3, "nick1", "nick2", "nick3", "nick4");
				console.log("Web socket이 살아있어요!");
				console.log(gt,gd,p1,p2,p3,p4);
			}
			else
			{
				// 강제로 main이나 lobby로 보내기
				// window.history.back();
				console.log("Web socket이 죽어있어요!");
			}
		}
		goBackButton.addEventListener("click", event => {
			if (window.websocket !== undefined && window.websocket.readyState === WebSocket.OPEN)
			{
				window.websocket.close();
				window.websocket = undefined;
			}
			navigateTo("/lobby");
		});
	}
}

