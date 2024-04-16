import AbstractComponent from "./AbstractComponent.js";
import { DOMAIN_NAME, navigateTo } from "../index.js";


export let gt = 1;
export let gd = 2;
export let p1 = "none1";
export let p2 = "none2";
export let p3 = "none3";
export let p4 = "none4";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("GameRoom");
	}

	async getHtml() {
		return `
		<div class="container-md text-center mt-md-4">
			<div class="row">
				<div class="col-7 p-2">
					<div class="row row-cols-1 row-cols-md-2 g-4">
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player1" style="max-width: 18rem;">
								<img src="/src/img/Room_crown.png" class="z-1 position-absolute m-2" style="width: 25%">
								<img src="/src/img/Room_null.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<span class="card-title" style="font-weight: 700; color: black; font-size: 1.5rem;">&nbsp</span>
									<span class="card-text text-secondary" style="font-weight: 700; font-size: 1.3rem;">&nbsp</span>
								</div>
								<div class="card-footer noto-sans bg-secondary" style="font-weight: 900; color: white; font-size: 1.5rem;">READY</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player2" style="max-width: 18rem;">
								<img src="/src/img/Room_null.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<span class="card-title" style="font-weight: 700; color: black; font-size: 1.5rem;">&nbsp</span>
									<span class="card-text text-secondary" style="font-weight: 700; font-size: 1.3rem;">&nbsp</span>
								</div>
								<div class="card-footer noto-sans bg-secondary" style="font-weight: 900; color: white; font-size: 1.5rem;">READY</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player3" style="max-width: 18rem;">
								<img src="/src/img/Room_null.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<span class="card-title" style="font-weight: 700; color: black; font-size: 1.5rem;">&nbsp</span>
									<span class="card-text text-secondary" style="font-weight: 700; font-size: 1.3rem;">&nbsp</span>
								</div>
								<div class="card-footer noto-sans bg-secondary" style="font-weight: 900; color: white; font-size: 1.5rem;">READY</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" id="player4" style="max-width: 18rem;">
								<img src="/src/img/Room_null.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<span class="card-title" style="font-weight: 700; color: black; font-size: 1.5rem;">&nbsp</span>
									<span class="card-text text-secondary" style="font-weight: 700; font-size: 1.3rem;">&nbsp</span>
								</div>
								<div class="card-footer noto-sans bg-secondary" style="font-weight: 900; color: white; font-size: 1.5rem;">READY</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-5 p-2" id="room_status">
					<div class="text-start p-3 mb-5" style="background-color: #4D37C6;">
						<div id="room_name" class="mb-3" style="font-weight: 700; color: white; font-size: 2rem;">TITLE</div>
						<div id="room_difficulty" style="font-weight: 700; color: white; font-size: 1.5rem;"></div>
						<div id="room_gametype" style="font-weight: 700; color: white; font-size: 1.5rem;"></div>
					</div>
					<div class="d-flex flex-column align-items-end">
						<button type="button" class="btn common-btn my-2" id="startBtn" style="width: 40%;">시작</button>
						<button type="button" class="btn common-btn my-2" id="readyBtn" style="width: 40%;">준비</button>
						<button type="button" class="btn common-btn my-2" id="exitBtn" style="width: 40%;">나가기</button>
					</div>
				</div>
			</div>
		</div>
		`;
	}

	handleRoute() {
		let rName;
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
		const websocketURL = `wss://${DOMAIN_NAME}:8000/ws/room/` + lastPart + '/?access_token=' + token;

		// WebSocket 객체 생성
		const websocket = new WebSocket(websocketURL);
		window.websocket = websocket;
		// console.log('웹 소켓 URL :', websocket);

		websocket.onerror = function () {
			if (websocket !== undefined && websocket.readyState === WebSocket.OPEN) {
				websocket.close();
				window.websocket = undefined;
			}
			// if (retryCount < maxRetry) {
			// 	setTimeout(() => {
			// 		console.log(`연결 실패. ${retryCount + 1}번째 재연결 시도 중...`);
			// 		retryCount++;
			// 		const websocket = new WebSocket(websocketURL);
			// 		window.websocket = websocket;
			// 	}, retryDelay);
			// } else {
			// 	console.log('WebSocket 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
			// 	navigateTo("/lobby");
			// 	// window.location.href = document.referrer;
			// }
		};

		// WebSocket 연결이 열렸을 때 실행되는 이벤트 핸들러
		websocket.onopen = function (event) {
			// console.log('WebSocket 연결이 열렸습니다.');
			// console.log('player 님이 방에 입장하셨습니다.');
			const dataToSend = {
				"action": "join"
			}
			websocket.send(JSON.stringify(dataToSend));
		};

		// WebSocket 연결이 닫혔을 때 실행되는 이벤트 핸들러
		websocket.onclose = function (event) {
			window.websocket = undefined;
			// console.log('WebSocket 연결이 닫혔습니다.');
			alert("연결이 끊어져 로비로 이동합니다.");
			navigateTo("/lobby");
			// window.location.href = document.referrer;
		};

		let playerNo = 0;

		// Player 입장 시 Room 정보 업데이트
		function dataUpdate(data) {
			// console.log(data["player_number"]);
			// console.log(typeof (data["player_number"]));
			switch (data["player_number"]) {
				case 1:
					const player1Node = document.querySelector("#player1");
					const player1NickNode = player1Node.querySelector(".card-title");
					const player1TagNode = player1Node.querySelector(".card-text");
					player1NickNode.innerText = data["user_nickname"];
					player1TagNode.innerText = "#" + data["id_tag"];
					p1 = data["user_nickname"];
					if (data["user_avatar"]) {
						player1Node.querySelector(".card-img-top").src = data["user_avatar"];
					}
					const player1ReadyNode = player1Node.querySelector(".card-footer");
					if (data["is_ready"]) {
						player1ReadyNode.classList.remove("bg-secondary");
						player1ReadyNode.classList.add("ready-style");
					}
					else {
						player1ReadyNode.classList.remove("ready-style");
						player1ReadyNode.classList.add("bg-secondary");
					}
					break;
				case 2:
					const player2Node = document.querySelector("#player2");
					const player2NickNode = player2Node.querySelector(".card-title");
					const player2TagNode = player2Node.querySelector(".card-text");
					player2NickNode.innerText = data["user_nickname"];
					player2TagNode.innerText = "#" + data["id_tag"];
					p2 = data["user_nickname"];
					if (data["user_avatar"]) {
						player2Node.querySelector(".card-img-top").src = data["user_avatar"];
					}
					const player2ReadyNode = player2Node.querySelector(".card-footer");
					if (data["is_ready"]) {
						player2ReadyNode.classList.remove("bg-secondary");
						player2ReadyNode.classList.add("ready-style");
					}
					else {
						player2ReadyNode.classList.remove("ready-style");
						player2ReadyNode.classList.add("bg-secondary");
					}
					break;
				case 3:
					const player3Node = document.querySelector("#player3");
					const player3NickNode = player3Node.querySelector(".card-title");
					const player3TagNode = player3Node.querySelector(".card-text");
					player3NickNode.innerText = data["user_nickname"];
					player3TagNode.innerText = "#" + data["id_tag"];
					p3 = data["user_nickname"];
					if (data["user_avatar"]) {
						player3Node.querySelector(".card-img-top").src = data["user_avatar"];
					}
					const player3ReadyNode = player3Node.querySelector(".card-footer");
					if (data["is_ready"]) {
						player3ReadyNode.classList.remove("bg-secondary");
						player3ReadyNode.classList.add("ready-style");
					}
					else {
						player3ReadyNode.classList.remove("ready-style");
						player3ReadyNode.classList.add("bg-secondary");
					}
					break;
				case 4:
					const player4Node = document.querySelector("#player4");
					const player4NickNode = player4Node.querySelector(".card-title");
					const player4TagNode = player4Node.querySelector(".card-text");
					player4NickNode.innerText = data["user_nickname"];
					player4TagNode.innerText = "#" + data["id_tag"];
					p4 = data["user_nickname"];
					if (data["user_avatar"]) {
						player4Node.querySelector(".card-img-top").src = data["user_avatar"];
					}
					const player4ReadyNode = player4Node.querySelector(".card-footer");
					if (data["is_ready"]) {
						player4ReadyNode.classList.remove("bg-secondary");
						player4ReadyNode.classList.add("ready-style");
					}
					else {
						player4ReadyNode.classList.remove("ready-style");
						player4ReadyNode.classList.add("bg-secondary");
					}
					break;
				default:
					console.log("player number error\n");
			}
		}

		function readyUpdate(data) {
			const playerNode = document.querySelector("#player" + data["player_number"]);
			const playerReadyNode = playerNode.querySelector(".card-footer");
			if (data["is_ready"]) {
				playerReadyNode.classList.remove("bg-secondary");
				playerReadyNode.classList.add("ready-style");
			}
			else {
				playerReadyNode.classList.remove("ready-style");
				playerReadyNode.classList.add("bg-secondary");
			}
		}

		function startUpdate(data) {
			if (data["status"] === "ok") {
				navigateTo("/game");
			} else {
				// console.log("not all players are ready yet!")
				alert("not all players are ready yet!")
			}
		};

		function leaveUpdate(playerNo) {
			switch (playerNo) {
				case 1:
					const player1Node = document.querySelector("#player1");
					const player1NickNode = player1Node.querySelector(".card-title");
					const player1TagNode = player1Node.querySelector(".card-text");
					const player1Ready = player1Node.querySelector(".card-footer");
					player1NickNode.innerHTML = "&nbsp";
					player1TagNode.innerHTML = "&nbsp";
					player1Ready.classList.remove("ready-style");
					player1Ready.classList.add("bg-secondary");
					player1Node.querySelector(".card-img-top").src = "/src/img/Room_null.png";
					break;
				case 2:
					const player2Node = document.querySelector("#player2");
					const player2NickNode = player2Node.querySelector(".card-title");
					const player2TagNode = player2Node.querySelector(".card-text");
					const player2Ready = player2Node.querySelector(".card-footer");
					player2NickNode.innerHTML = "&nbsp";
					player2TagNode.innerHTML = "&nbsp";
					player2Ready.classList.remove("ready-style");
					player2Ready.classList.add("bg-secondary");
					player2Node.querySelector(".card-img-top").src = "/src/img/Room_null.png";
					break;
				case 3:
					const player3Node = document.querySelector("#player3");
					const player3NickNode = player3Node.querySelector(".card-title");
					const player3TagNode = player3Node.querySelector(".card-text");
					const player3Ready = player3Node.querySelector(".card-footer");
					player3NickNode.innerHTML = "&nbsp";
					player3TagNode.innerHTML = "&nbsp";
					player3Ready.classList.remove("ready-style");
					player3Ready.classList.add("bg-secondary");
					player3Node.querySelector(".card-img-top").src = "/src/img/Room_null.png";
					break;
				case 4:
					const player4Node = document.querySelector("#player4");
					const player4NickNode = player4Node.querySelector(".card-title");
					const player4TagNode = player4Node.querySelector(".card-text");
					const player4Ready = player4Node.querySelector(".card-footer");
					player4NickNode.innerHTML = "&nbsp";
					player4TagNode.innerHTML = "&nbsp";
					player4Ready.classList.remove("ready-style");
					player4Ready.classList.add("bg-secondary");
					player4Node.querySelector(".card-img-top").src = "/src/img/Room_null.png";
					break;
				default:
					// console.log("player number error\n");
					alert("player  number error\n");
			}
		};

		websocket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			// console.log('받은 메시지의 action : ', data["action"]);
			// console.log(data);


			if (data["action"] === "player_joined") {
				// console.log("룸 데이터 : ", data["room_data"]);
				const room_data = data["room_data"];
				rName = room_data[0]["room_name"];
				gt = room_data[0]["room_type"];
				gd = room_data[0]["room_difficulty"];
				changeRightDisplay();
				// console.log("플레이어 아바타 : ", data["user_avatar"]);
				if (playerNo === 0)
					playerNo = data["player_number"];
				dataUpdate(data);
				if (data["players"]) {
					const players = data["players"];
					players.forEach(player => {
						dataUpdate(player);
					})
				}
			} else if (data["action"] === "ready") {
				readyUpdate(data);
			} else if (data["action"] === "start") {
				startUpdate(data);
			} else if (data["action"] === "terminate") {
				// console.log('방장이 방을 종료했습니다.');
				alert("방이 종료되어 로비로 이동합니다.");
				websocket.close();
			} else if (data["action"] === "player_left") {
				const userUuid = data["user_uuid"];
				const playerNum = data["player_number"];
				// console.log(`플레이어 ${userUuid}가 방에서 나갔습니다.`);
				if (playerNo === playerNum) {
					// console.log('You have left the room. Closing WebSocket connection.');
					alert("당신은 방에서 나갔습니다. 로비로 이동합니다.");
					playerNo = 0;
					websocket.close();
				} else {
					// console.log(`Removing player ${userUuid} from the UI.`);
					leaveUpdate(playerNum);
				}
			}
		};

		function changeRightDisplay() {
			const roomStatusDiv = document.querySelector("#room_status");
			const roomNameDiv = roomStatusDiv.querySelector("#room_name");
			const roomDifficultyDiv = roomStatusDiv.querySelector("#room_difficulty");
			const roomGametypeDiv = roomStatusDiv.querySelector("#room_gametype");

			const player1Node = document.querySelector("#player1");
			const player2Node = document.querySelector("#player2");
			const player3Node = document.querySelector("#player3");
			const player4Node = document.querySelector("#player4");
			
			if (rName)
				roomNameDiv.innerText = rName;
			if (gd === 1)
				roomDifficultyDiv.innerText = "DIFFICULTY: EASY";
			else if (gd === 2)
				roomDifficultyDiv.innerText = "DIFFICULTY: NORMAL";
			else if (gd === 3)
				roomDifficultyDiv.innerText = "DIFFICULTY: HARD";
			if (gt === 1) {
				roomGametypeDiv.innerText = "MODE: 1 VS 1";
				player3Node.querySelector(".card-img-top").src = "/src/img/Room_block.png";
				player4Node.querySelector(".card-img-top").src = "/src/img/Room_block.png";
			}
			else if (gt === 2) {
				roomGametypeDiv.innerText = "MODE: 2 VS 2";
				player1Node.querySelector(".card-body").classList.add("card-body-lteam");
				player2Node.querySelector(".card-body").classList.add("card-body-lteam");
				player3Node.querySelector(".card-body").classList.add("card-body-rteam");
				player4Node.querySelector(".card-body").classList.add("card-body-rteam");
			}
			else if (gt === 3)
				roomGametypeDiv.innerText = "MODE: Tournament";
		}

		const startBtn = document.querySelector("#startBtn");
		startBtn.addEventListener("click", event => {
			const dataToSend = {
				"action": "start"
			}
			// console.log("start message send");
			websocket.send(JSON.stringify(dataToSend));
		});

		const readyBtn = document.querySelector("#readyBtn");
		readyBtn.addEventListener("click", event => {
			is_ready = is_ready ? false : true;
			const dataToSend = {
				"action": "ready",
				"is_ready": is_ready
			}
			// console.log("ready message send");
			websocket.send(JSON.stringify(dataToSend));
		});

		const goBackBtn = document.querySelector("#exitBtn");
		goBackBtn.addEventListener("click", event => {
			const dataToSend = {
				"action": "leave",
			}
			// console.log("leave room message send");
			websocket.send(JSON.stringify(dataToSend));
		});
	}
}
