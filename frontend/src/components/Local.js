import AbstractComponent from "./AbstractComponent.js";
import {init as basicPong} from "../games/localPongBasic.js"
import {init as multiplePong} from "../games/localPongMultiple.js"
import {init as tournamentPong} from "../games/localPongTournament.js"
import {containerEventKeyUp, containerEventKeyDown} from "../games/localPongBasic.js"
import {containerEventKeyUp as containerEventKeyUpM, containerEventKeyDown as containerEventKeyDownM} from "../games/localPongMultiple.js"
import {containerEventKeyUp as containerEventKeyUpT, containerEventKeyDown as containerEventKeyDownT} from "../games/localPongTournament.js"


import animateGame from "../utils/animateGameModule.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Local");
	}

	async getHtml() {
		return `
		<style>
			div {margin:auto; text-align: center;}
			canvas {align-self: center; margin:auto;}
		</style>
		<div class="tournamentForm"></div>
		<div class="selecter">
			<h1>Local Pong Game</h1>
			<p>please, select the mode</p>
		</div>
		<div>
			<button type="button" class="btn btn-primary" id="basicPongButton">BASIC</button>
			<button type="button" class="btn btn-primary" id="multiplePongButton">MULTIPLE</button>
			<button type="button" class="btn btn-primary" id="tournamentPongButton">TOURNAMENT</button>
			<button type="button" class="btn btn-primary" id="goBackButton">돌아가기</button>
		</div>
		<div class="result">
		</div>
		`;
	}
	
	clearKeyEvent() {
		window.document.removeEventListener('keydown', containerEventKeyDown);
		window.document.removeEventListener('keyup', containerEventKeyUp);
		window.document.removeEventListener('keydown', containerEventKeyDownM);
		window.document.removeEventListener('keyup', containerEventKeyUpM);
		window.document.removeEventListener('keydown', containerEventKeyDownT);
		window.document.removeEventListener('keyup', containerEventKeyUpT);
	}

	handleRoute() {
		animateGame.setAnimateOff();
		const tournamentFormDiv = document.querySelector(".tournamentForm");
		const selecterDiv = document.querySelector(".selecter");
		const basicPongButton = document.querySelector("#basicPongButton");
		const multiplePongButton = document.querySelector("#multiplePongButton");
		const tournamentPongButton = document.querySelector("#tournamentPongButton");
		const goBackButton = document.querySelector("#goBackButton");
		const resultDiv = document.querySelector(".result");

		basicPongButton.addEventListener("click", async event => {
			this.clearKeyEvent();
			tournamentFormDiv.style.display = 'none';
			selecterDiv.style.display = 'block';
			resultDiv.style.display = 'none';
			selecterDiv.innerHTML = `
			<h1>Basic Pong</h1>
			<h3 id="scoreBoardB"></h3>
			<div id="containerB"></div>`;
			resultDiv.innerHTML = `
			<br><br>
			<h2>Game result</h2>
			<p>local game does not save a result in server</p>
			<h3>player 1 vs player 2</h3>
			<div id="resultB"></div>`;
			basicPongButton.style.display = 'none';
			multiplePongButton.style.display = 'inline';
			tournamentPongButton.style.display = 'inline';
			animateGame.setAnimateOff();
			basicPong();
		});
		multiplePongButton.addEventListener("click", async event => {
			this.clearKeyEvent();
			tournamentFormDiv.style.display = 'none';
			selecterDiv.style.display = 'block';
			resultDiv.style.display = 'none';
			selecterDiv.innerHTML = `
			<h1>Multiple Pong</h1>
			<h3 id="scoreBoardM"></h3>
			<div id="containerM"></div>`;
			resultDiv.innerHTML = `
			<br><br>
			<h2>Game result</h2>
			<p>local game does not save a result in server</p>
			<h3>player 1 vs player 2</h3>
			<div id="resultM"></div>`;
			basicPongButton.style.display = 'inline';
			multiplePongButton.style.display = 'none';
			tournamentPongButton.style.display = 'inline';
			animateGame.setAnimateOff();
			multiplePong();
		});
		tournamentPongButton.addEventListener("click", async event => {
			this.clearKeyEvent();
			tournamentFormDiv.style.display = 'block';
			selecterDiv.style.display = 'none';
			resultDiv.style.display = 'none';
			tournamentFormDiv.innerHTML = `
			<h1>Tournament Pong</h1>
			<h3>Please enter a player's nickname and check a difficulty</h3>
			<div>
				<form id="inputForm">
					<h4>Difficulty</h4>
					<input type="radio" id="option1" name="difficulty" value="1">
					<label for="option1">Easy</label><br>
					<input type="radio" id="option2" name="difficulty" value="2" checked>
					<label for="option2">Normal</label><br>
					<input type="radio" id="option3" name="difficulty" value="3">
					<label for="option3">Hard</label><br>
					<h4>nickname : alphabet only</h4>
					<label for="player1">player 1:</label>
					<input type="text" id="player1" name="player1" pattern="[A-Za-z]+" required><br>
					<label for="player2">player 2:</label>
					<input type="text" id="player2" name="player2" pattern="[A-Za-z]+" required><br>
					<label for="player3">player 3:</label>
					<input type="text" id="player3" name="player3" pattern="[A-Za-z]+" required><br>
					<label for="player4">player 4:</label>
					<input type="text" id="player4" name="player4" pattern="[A-Za-z]+" required><br>
					<button type="button" class="btn btn-primary" id="tournamentSubmitButton">입장하기</button>
				</form><br>
			</div>`;
			const tournamentSubmitButton = document.querySelector("#tournamentSubmitButton");
			tournamentSubmitButton.addEventListener("click", async event => {
				event.preventDefault(); // 폼 제출 기본 동작 막기

				// 변수 선언
				let difficulty;
				let player1;
				let player2;
				let player3;
				let player4;

				// 선택한 옵션 가져오기
				difficulty = document.querySelector('input[name="difficulty"]:checked').value;


				// 각각의 닉네임 가져오기
				if (document.getElementById('player1').checkValidity() && document.getElementById('player2').checkValidity() && document.getElementById('player3').checkValidity() && document.getElementById('player4').checkValidity())
				{
					player1 = document.getElementById('player1').value;
					player2 = document.getElementById('player2').value;
					player3 = document.getElementById('player3').value;
					player4 = document.getElementById('player4').value;
				}

				// 중복 검사
				if (player1 === player2 || player2 === player3 || player3 === player4 || player1 === player4 || player1 === player3 || player2 === player4)
				{
					player1 = undefined;
					player2 = undefined;
					player3 = undefined;
					player4 = undefined;
				}

				// 받은 정보 출력하기
				console.log("선택한 옵션: " + difficulty);
				console.log("닉네임1: " + player1);
				console.log("닉네임2: " + player2);
				console.log("닉네임3: " + player3);
				console.log("닉네임4: " + player4);
				
				// 토너먼트 게임
				if (player1 && player2 && player3 && player4)
				{
					tournamentFormDiv.style.display = 'none';
					selecterDiv.style.display = 'block';
					resultDiv.style.display = 'none';
					selecterDiv.innerHTML = `
					<h1>Tournament Pong</h1>
					<h3 id="scoreBoardT"></h3>
					<div id="containerT"></div>`;
					resultDiv.innerHTML = `
					<br><br>
					<h2>Game result</h2>
					<p>local game does not save a result in server</p>
					<h3><b>left</b> vs <b>right</b></h3>
					<div id="resultT"></div>`;
					animateGame.setAnimateOff();
					tournamentPong(difficulty, player1, player2, player3, player4);
				}
			});
			basicPongButton.style.display = 'inline';
			multiplePongButton.style.display = 'inline';
			tournamentPongButton.style.display = 'none';
		});
		goBackButton.addEventListener("click", event => {
			window.history.back();
		});
	}
}

