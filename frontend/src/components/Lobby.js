import AbstractComponent from "./AbstractComponent.js";

const GAMEROOM_KEY = "gameroom";

let gameRooms = [];

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Lobby");
	}

	async getHtml() {
		return `
		<div class="modal fade" id="openGameRoomModal" tabindex="-1" aria-labelledby="openGameRoomModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="openGameRoomModalLabel">방 만들기</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form>
							<div class="mb-3">
								<label for="title-name" class="col-form-label">TITLE</label>
								<input type="text" class="form-control" id="title-name" placeholder="방 타이틀을 입력하세요.">
							</div>
							<div class="row">
								<div class="col">
									<label class="col-form-label">MODE</label>
										<div class="form-check">
											<input class="form-check-input" type="radio" name="flexRadioMode" id="flexRadioMode1" value="easy" checked>
											<label class="form-check-label" for="flexRadioMode1">
												EASY
											</label>
										</div>
										<div class="form-check">
											<input class="form-check-input" type="radio" name="flexRadioMode" id="flexRadioMode2" value="normal">
											<label class="form-check-label" for="flexRadioMode2">
												NORMAL
											</label>
										</div>
										<div class="form-check">
											<input class="form-check-input" type="radio" name="flexRadioMode" id="flexRadioMode3" value="hard">
											<label class="form-check-label" for="flexRadioMode3">
												HARD
											</label>
										</div>
								</div>
								<div class="col">
									<label class="col-form-label">PLAYER</label>
										<div class="form-check">
											<input class="form-check-input" type="radio" name="flexRadioHC" id="flexRadioHC1" value="2" checked>
											<label class="form-check-label" for="flexRadioHC1">
												2 player
											</label>
										</div>
										<div class="form-check">
											<input class="form-check-input" type="radio" name="flexRadioHC" id="flexRadioHC2" value="4">
											<label class="form-check-label" for="flexRadioHC2">
												4 player
											</label>
										</div>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="gameroom-save">Save changes</button>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<button type="button" class="btn btn-outline-dark" id="gameroom-list-reload">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
					<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
					</svg>
				</button>
				<div class="list-group" id="gameroom-list" role="tablist"></div>
			</div>
			<div class="col">
				<div class="tab-content" id="gameroom-content"></div>
				<button type="button" class="btn btn-outline-dark" id="gameroom-enter">방 참가</button>
				<button type="button" class="btn btn-outline-dark" id="gameroom-open" data-bs-toggle="modal" data-bs-target="#openGameRoomModal">방 만들기</button>
			</div>
		</div>
		`;
	}

	/* gameroom {
		id: Date.now();
		name:
		mode:
		player:
	} */

	reloadGameRoomList() {
		const gameRoomList = document.querySelector('#gameroom-list');
		const gameRoomContent = document.querySelector('#gameroom-content');
		gameRoomList.replaceChildren();
		gameRoomContent.replaceChildren();
		
		const saveGameRoomList = localStorage.getItem(GAMEROOM_KEY);
		
		if (saveGameRoomList !== null) {
			const parsedGameRoomList = JSON.parse(saveGameRoomList);
			gameRooms = parsedGameRoomList;
			parsedGameRoomList.forEach(gameRoomData => {
				const gameRoomID = gameRoomData.id;
				gameRoomList.insertAdjacentHTML("beforeend",`
				<a class="list-group-item list-group-item-action" id="gameroom-${gameRoomID}-list" data-bs-toggle="list" href="#gameroom-${gameRoomID}" role="tab" aria-controls="gameroom-${gameRoomID}">${gameRoomData.name}</a>
				`);
				gameRoomContent.insertAdjacentHTML("beforeend", `
				<div class="tab-pane fade" id="gameroom-${gameRoomID}" role="tabpanel" aria-labelledby="gameroom-${gameRoomID}-list">
					<h3>${gameRoomData.name}</h3>
					<p>Mode: ${gameRoomData.mode}</p>
					<p>Player: ${gameRoomData.player} player</p>
				</div>
				`);
			});
		}
	}

	handleRoute() {
		this.reloadGameRoomList();

		const gameRoomListReloadBtn = document.querySelector("#gameroom-list-reload");
		gameRoomListReloadBtn.addEventListener("click", event => {
			this.reloadGameRoomList();
		})

		const gameRoomEnterBtn = document.querySelector("#gameroom-enter");
		gameRoomEnterBtn.addEventListener("click", event => {
			const selectGameRoom = document.querySelector("[aria-selected='true']");
			console.log(selectGameRoom);
		})

		const gameRoomSaveBtn = document.querySelector("#gameroom-save");
		gameRoomSaveBtn.addEventListener("click", event => {
			event.preventDefault();
			const newGameRoom = {
				id: Date.now(),
				name: document.querySelector("#title-name").value,
				mode: document.querySelector("input[name='flexRadioMode']:checked").value,
				player: document.querySelector("input[name='flexRadioHC']:checked").value,
			}
			gameRooms.push(newGameRoom);
			localStorage.setItem(GAMEROOM_KEY, JSON.stringify(gameRooms));
			this.reloadGameRoomList();
		})
	}
}