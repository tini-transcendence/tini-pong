import AbstractComponent from "./AbstractComponent.js";
import {DOMAIN, navigateTo} from "../index.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("GameRoom");
	}

	async getHtml() {
		return `
		<div class="container-md text-center">
			<div class="row">
				<div class="col-7 border p-2">
					<div class="row row-cols-1 row-cols-md-2 g-4">
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player1" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready : ?</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player2" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready : ?</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player3" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready : ?</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player4" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready : ?</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-5 border p-2">
					<div class="m-auto" style="background-color: #ced4da;" spacing="2.4rem">
						<h4>TITLE</h4>
					</div>
				</div>
			</div>
			<button type="button" class="btn btn-primary" id="startBtn"">시작</button>
			<button type="button" class="btn btn-primary" id="readyBtn"">준비</button>
			<button type="button" class="btn btn-primary" id="exitBtn">나가기</button>
		</div>
		`;
	}

	handleRoute() {
		let retryCount = 0;
		const maxRetry = 3;
		const retryDelay = 2000;
		let is_ready = false;

		const token = document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1];

		// 현재 페이지의 URL 가져오기
		const currentURL = window.location.href;
		// 정규 표현식을 사용하여 "/"로 시작하고 끝나는 문자열 추출
		const match = currentURL.match(/\/([^\/]+)\/?$/);
		// 추출된 문자열 출력
		const lastPart = match ? match[1] : null;
		const websocketURL = `wss://${DOMAIN}:8000/ws/room/` + lastPart + '/?access_token=' + token;

		// WebSocket 객체 생성
		const websocket = new WebSocket(websocketURL);
		window.websocket = websocket;
		console.log('웹 소켓 URL :', websocket);

		websocket.onerror = function () {
			if (retryCount < maxRetry) {
				setTimeout(() => {
					console.log(`연결 실패. ${retryCount + 1}번째 재연결 시도 중...`);
					retryCount++;
					const websocket = new WebSocket(websocketURL);
				}, retryDelay);
			} else {
				console.log('WebSocket 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
				navigateTo("/lobby");
				// window.location.href = document.referrer;
			}
		};

		// WebSocket 연결이 열렸을 때 실행되는 이벤트 핸들러
		websocket.onopen = function (event) {
			console.log('WebSocket 연결이 열렸습니다.');
			console.log('player 님이 방에 입장하셨습니다.');
			const dataToSend = {
				"action": "join"
			}
			websocket.send(JSON.stringify(dataToSend));
		};

		// WebSocket 연결이 닫혔을 때 실행되는 이벤트 핸들러
		websocket.onclose = function (event) {
			console.log('WebSocket 연결이 닫혔습니다.');
			alert("로비로 이동합니다.")
			navigateTo("/lobby");
			// window.location.href = document.referrer;
		};

		function dataUpdate(data) {
			switch (data["player_number"]) {
				case 1:
					const player1Node = document.querySelector("#player1");
					const player1NickNode = player1Node.querySelector(".card-title");
					player1NickNode.innerText = data["user_nickname"];
					break;
				case 2:
					const player2Node = document.querySelector("#player2");
					const player2NickNode = player2Node.querySelector(".card-title");
					player2NickNode.innerText = data["user_nickname"];
					break;
				case 3:
					const player3Node = document.querySelector("#player3");
					const player3NickNode = player3Node.querySelector(".card-title");
					player3NickNode.innerText = data["user_nickname"];
					break;
				case 4:
					const player4Node = document.querySelector("#player4");
					const player4NickNode = player4Node.querySelector(".card-title");
					player4NickNode.innerText = data["user_nickname"];
					break;
				default:
					console.log("player number error\n");
			}
		}

		function readyUpdate(data) {
			const playerNode = document.querySelector("#player" + data["player_number"]);
			const playerReadyNode = playerNode.querySelector(".card-footer");
			if (data["is_ready"])
				playerReadyNode.innerText = "Ready : Yes";
			else
				playerReadyNode.innerText = "Ready : No";
		}

		function startUpdate(data) {
			if (data["status"] === "ok") {
				navigateTo("/game");
			} else {
				console.log("not all players are ready yet!")
			}
		};

		websocket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			console.log('받은 메시지의 action : ', data["action"]);

			if (data["action"] === "player_joined") {
				dataUpdate(data);
			} else if (data["action"] === "ready") {
				readyUpdate(data);
			} else if (data["action"] === "start") {
				startUpdate(data);
			} else if (data["action"] === "terminate") {
				websocket.close();
			}
		};

		const startBtn = document.querySelector("#startBtn");
		startBtn.addEventListener("click", event => {
			const dataToSend = {
				"action": "start"
			}
			console.log("start message send");
			websocket.send(JSON.stringify(dataToSend));
		});

		const readyBtn = document.querySelector("#readyBtn");
		readyBtn.addEventListener("click", event => {
			is_ready = is_ready ? false : true;
			const dataToSend = {
				"action": "ready",
				"is_ready": is_ready
			}
			console.log("ready message send");
			websocket.send(JSON.stringify(dataToSend));
		});

		const goBackBtn = document.querySelector("#exitBtn");
		goBackBtn.addEventListener("click", event => {
			const dataToSend = {
				"action": "leave",
			}
			console.log("leave room message send");
			websocket.send(JSON.stringify(dataToSend));
		});
	}
}
