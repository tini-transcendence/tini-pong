import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js";

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
						<a class="nav-link" href="/tdata" data-href="/tdata">MatchLog</a>
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
				<ul class="list-group row" id="friend-list" style="padding: 1rem"></ul>
			</div>
		</div>
		`;
	}

	handleRoute() {
		const fetchRemoveFriend = async (removeFriend) => {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request("http://localhost:8000/friend/delete", {
					method: 'DELETE',
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						target_uuid: removeFriend.uuid,
					}),
				}));
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				else if (response.status === 204) {
					throw new Error("Already deleted");
				}
			} catch (error) {
				console.log(error.message);
			}
		}

		const fetchAddFriend = async (data) => {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request("http://localhost:8000/friend/add/", {
					method: 'POST',
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						target_uuid: data.uuid,
					}),
				}));
				if (response.ok) {
					friends.push(data);
					addFriendList(data);
				}
				else if (response.status === 409)
				{
					throw new Error("Already friend");
				}
				else if (response.status === 400)
					throw new Error("Cannot add myself");
				else
					throw new Error(response.statusText);
			} catch (error) {
				console.log(error.message);
			}
		}

		const fetchFriendList = async () => {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request("http://localhost:8000/friend/", {
					method: 'GET',
					credentials: "include",
				}));
				if (response.ok) {
					const data = await response.json();
					friends = data;
					friends.forEach(element => {
						addFriendList(element);
					})
				}
				else
					throw new Error(response.statusText);
			} catch (error) {
				console.log(error.message);
			}
		}

		const fetchSearchFriend = async (foundUser) => {
			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request(`http://localhost:8000/friend/search?nickname=${foundUser}`, {
					method: 'GET',
					credentials: "include",
				}));
				if (response.ok) {
					const data = await response.json();
					if (Object.keys(data).length !== 0) { // 유저가 존재하는 경우
						resultSearchUser.insertAdjacentHTML("beforeend", `
						<div class="alert alert-light d-flex align-items-center" role="alert">
							<a href="/users/${data.nickname}" class="link-offset-2 link-underline link-underline-opacity-0 link-dark">${data.nickname}</a>
							<button type="button" class="btn btn-outline-secondary">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
									<path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
									<path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
								</svg>
							</button>
						</div>
						`);

						const resultItemBtn = resultSearchUser.querySelector("button");
						resultItemBtn.addEventListener("click", async event => {
							fetchAddFriend(data);
						})
					}
					else { // 유저가 없는 경우
						resultSearchUser.insertAdjacentHTML("beforeend", `
						<div class="alert alert-danger d-flex align-items-center" role="alert">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
								<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
							</svg>
							<div>유저가 없습니다.</div>
						</div>
						`);
					}
				}
				else if (response.status === 400) {
					resultSearchUser.insertAdjacentHTML("beforeend", `
						<div class="alert alert-primary d-flex align-items-center" role="alert">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
								<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
							</svg>
							<div>자기 자신은 추가할 수 없습니다.</div>
						</div>
						`);
				}
				else
					throw new Error(response.statusText);
			} catch (error) {
				console.log(error.message);
			}
		}

		const addFriendList = (element) => {
			const newFriendListNode = document.createElement("li");
			newFriendListNode.setAttribute("class", "list-group-item");

			const newStatusNode = document.createElement("span");
			if (element.status === true) {
				newStatusNode.setAttribute("class", "badge bg-success rounded-pill");
				newStatusNode.innerText = "online";
			}
			else {
				newStatusNode.setAttribute("class", "badge bg-secondary rounded-pill");
				newStatusNode.innerText = "offline";
			}

			newFriendListNode.insertAdjacentHTML("beforeend", `
			<div class="d-flex flex-wrap">
				<div class="p-2 me-auto">
					<a href="/users/${element.nickname}" class="link-offset-2 link-underline link-underline-opacity-0 link-dark">${element.nickname}</a>
				</div>
				<div class="p-2" id="online-status"></div>
				<div>
					<button class="btn btn-outline-secondary" type="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
							<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
							<path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
						</svg>
					</button>
				</div>
			</div>
			`);
			newFriendListNode.querySelector("#online-status").appendChild(newStatusNode);
			document.querySelector("#friend-list").appendChild(newFriendListNode);

			newFriendListNode.querySelector("button").addEventListener("click", event => {
				const removeFriend = friends.find(element => element.nickname === newFriendListNode.querySelector("a").innerText);
				newFriendListNode.remove();
				fetchRemoveFriend(removeFriend);
			})
		}

		const friendList = document.querySelector("#friend-list");
		friendList.replaceChildren();
		fetchFriendList();

		const offcanvasSearchUserBtn = document.querySelector("#button-offcanvasSearchUser");
		offcanvasSearchUserBtn.addEventListener("click", event => {
			const foundUser = document.querySelector("input[aria-describedby='button-offcanvasSearchUser']").value;
			const resultSearchUser = document.querySelector("#resultSearchUser");
			resultSearchUser.replaceChildren();
			fetchSearchFriend(foundUser);
		})
	}
}