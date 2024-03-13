import AbstractComponent from "./AbstractComponent.js";

const USERNAME_KEY = "user";
const MYNICK_KEY = "login";
const FRIEND_KEY = "friend";

let friends = [];

export default class extends AbstractComponent {
	constructor() {
		super();
	}

	async getHtml() {
		return `
		<nav class="navbar navbar-expand sticky-top" style="background-color: #e3f2fd;">
			<div class="container-fluid">
				<a class="navbar-brand" href="/" data-href="/">TITLE</a>
				<div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
					<div class="navbar-nav">
						<a class="nav-link" href="/mypage" data-href="/mypage">MyPage</a>
						<button class="nav-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFriend" aria-controls="offcanvasFriend">Friend</button>
					</div>
				</div>
			</div>
		</nav>
		<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFriend" aria-labelledby="offcanvasFriendLabel">
			<div class="offcanvas-header" style="background-color: #e3f2fd;">
				<h4 class="offcanvas-title" id="offcanvasFriendLabel">Friend</h5>
				<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body container">
				<div class="row border-bottom">
					<div class="input-group mb-3">
						<input type="text" class="form-control" placeholder="Search username" aria-label="Search username" aria-describedby="button-offcanvasSearchUser">
						<button class="btn btn-outline-secondary" type="button" id="button-offcanvasSearchUser">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
							</svg>
						</button>
					</div>
					<div id="resultSearchUser"></div>
				</div>
				<template id="friend-list-item">
					<li class="list-group-item">
						<a href="#" class="link-offset-2 link-underline link-underline-opacity-0 link-dark">example1</a>
						<button class="btn btn-outline-secondary" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
								<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
								<path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
							</svg>
						</button>
					</li>
				</template>
				<ul class="list-group row" id="friend-list" style="padding: 1rem"></ul>
			</div>
		</div>
		`;
	}

	addFriendList(element) {
		const friendList = document.querySelector("#friend-list");
		const friendListTemplate = document.querySelector("#friend-list-item");
		const friendListNode = friendListTemplate.content.children[0];
		const newFriendListNode = friendListNode.cloneNode(true);
		const newFriendListNodeA = newFriendListNode.querySelector("a");
		newFriendListNodeA.setAttribute("href", `/users/${element}`);
		newFriendListNodeA.innerText = element;
		friendList.appendChild(newFriendListNode);

		newFriendListNode.querySelector("button").addEventListener("click", event => {
			friends = friends.filter(element => element !== newFriendListNodeA.innerText);
			newFriendListNode.remove();
			localStorage.setItem(FRIEND_KEY, JSON.stringify(friends));
		})
	}

	handleRoute() {
		const friendList = document.querySelector("#friend-list");
		friendList.textContent = "";
		const saveFriendList = localStorage.getItem(FRIEND_KEY);
		if (saveFriendList !== null) {
			const parsedFriendList = JSON.parse(saveFriendList);
			friends = parsedFriendList;
			friends.forEach(element => {
				this.addFriendList(element);
			});
		}

		const offcanvasSearchUserBtn = document.querySelector("#button-offcanvasSearchUser");
		offcanvasSearchUserBtn.addEventListener("click", event => {
			const foundUser = document.querySelector("input[aria-describedby='button-offcanvasSearchUser']").value;
			const resultSearchUser = document.querySelector("#resultSearchUser");

			resultSearchUser.textContent = "";
			const saveUserList = localStorage.getItem(USERNAME_KEY);
			if (saveUserList !== null) {
				const parsedUserList = JSON.parse(saveUserList);
				const userObject = parsedUserList.find(o => o.name === foundUser);
				if (userObject) {
					const resultItem = document.createElement("div");
					resultItem.setAttribute("class", "alert alert-light d-flex align-items-center");
					resultItem.setAttribute("role", "alert");
					const resultItemText = document.createElement("div");
					resultItemText.innerText = foundUser;
					const resultItemBtn = document.createElement("button");
					resultItemBtn.setAttribute("type", "button");
					resultItemBtn.setAttribute("class", "btn btn-outline-secondary");
					const resultItemIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
					resultItemIcon.setAttribute("class", "bi bi-person-plus");
					resultItemIcon.setAttribute("width", "16");
					resultItemIcon.setAttribute("height", "16");
					resultItemIcon.setAttribute("fill", "currentColor");
					resultItemIcon.setAttribute("viewBox", "0 0 16 16");
					const resultItemIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
					resultItemIconPath.setAttribute("d", "M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z");
					const resultItemIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					resultItemIconPath2.setAttribute("fill-rule", "evenodd");
					resultItemIconPath2.setAttribute("d", "M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5");

					resultItemIcon.appendChild(resultItemIconPath);
					resultItemIcon.appendChild(resultItemIconPath2);
					resultItemBtn.appendChild(resultItemIcon);
					resultItem.appendChild(resultItemText);
					resultItem.appendChild(resultItemBtn);
					resultSearchUser.appendChild(resultItem);

					resultItemBtn.addEventListener("click", event => {
						const myNickName = localStorage.getItem(MYNICK_KEY);
						
						if (friends.some(e => { // 1. 이미 친구추가된 닉네임일 경우
							if (e === foundUser) {return true}
						})) {
							console.log("이미 친구");
						}
						else if (foundUser === myNickName) // 2. 본인의 닉네임일 경우
							console.log("본인");
						else { // 3. 추가가 가능한 경우
							friends.push(foundUser);
							localStorage.setItem(FRIEND_KEY, JSON.stringify(friends));
							this.addFriendList(foundUser);
						}
					})
				}
				else {
					const resultItem = document.createElement("div");
					resultItem.setAttribute("class", "alert alert-danger d-flex align-items-center");
					resultItem.setAttribute("role", "alert");
					const resultItemIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
					resultItemIcon.setAttribute("class", "bi bi-exclamation-triangle-fill flex-shrink-0 me-2");
					resultItemIcon.setAttribute("width", "16");
					resultItemIcon.setAttribute("height", "16");
					resultItemIcon.setAttribute("viewBox", "0 0 16 16");
					resultItemIcon.setAttribute("role", "img");
					resultItemIcon.setAttribute("aria-label", "Warning:");
					const resultItemIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
					resultItemIconPath.setAttribute("d", "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z");
					const resultItemText = document.createElement("div");
					resultItemText.innerText = "유저가 없습니다.";

					resultItemIcon.appendChild(resultItemIconPath);
					resultItem.appendChild(resultItemIcon);
					resultItem.appendChild(resultItemText);
					resultSearchUser.appendChild(resultItem);
				}
			}
		})
	}
}