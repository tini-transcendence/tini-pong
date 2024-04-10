import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js";
import {BACKEND_URL} from "../index.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("UserPage");
	}

	async getHtml() {
		return `
		<div class="container-fluid">
			<div class="row row-cols-1 row-cols-md-2 m-md-3 mt-3">
				<div class="col col-md-4 p-2 border" id="userpage-profile">
					<div class="text-center mb-3">
						<img id="userpage-profile-avatar" src="/src/img/default_profile.png" width="200px" height="200px" alt="profile thumbnail" style="border-radius: 20%;"/>
					</div>
					<div class="text-center">
						<h3 id="userpage-profile-nickname">Nickname</h3>
						<h4 class="text-secondary" id="userpage-profile-idtag">Tag</h3>
					</div>
					<div class="mx-2 border">
						<p id="userpage-profile-message">This is My Page.</p>
					</div>
					<div id="userpage-edit"></div>
				</div>
				<div class="col col-md-8 p-2 border">
					<div class="text-center mb-3">
						<div class="btn-group" id="log-btn-group" role="group" aria-label="Match Mode Select Btn">
							<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
							<label class="btn common-radio-btn" for="btnradio1">1 VS 1</label>

							<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
							<label class="btn common-radio-btn" for="btnradio2">2 VS 2</label>

							<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
							<label class="btn common-radio-btn" for="btnradio3">Tournament</label>
						</div>
					</div>
					<div class="mx-xl-3">
						<div class="row">
							<div class="col">승률</div>
							<div class="col" style="text-align: right" id="rate-progress">25%</div>
						</div>
						<div class="progress-stacked" id="winrate-progress">
							<div class="progress" role="progressbar" aria-label="Segment-win" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="width: 15%">
								<div class="progress-bar progress-bar-striped">15</div>
							</div>
							<div class="progress" role="progressbar" aria-label="Segment-lose" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
								<div class="progress-bar progress-bar-striped bg-danger">85</div>
							</div>
						</div>
					</div>
					<ul class="mt-4 overflow-auto" id="log-pannel" style="height: 500px; padding-left: 0;"></ul>
				</div>
			</div>
		</div>
		`;
	}

	handleRoute(param) {
		const profileSetting = async () => {
			try {
				let fetchString = "";
				if (param.useruuid)
					fetchString = `?uuid=${param.useruuid}`;
				else {
					document.querySelector("#userpage-edit").insertAdjacentHTML("beforeend", `
					<div class="m-3 text-end">
						<a class="btn btn-primary btn-sm" href="/edit" data-href="/edit" role="button" style="--bs-btn-bg: #4D37C6; --bs-btn-border-color: #4D37C6;">edit</a>
					</div>
					`);
				}
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request(`${BACKEND_URL}/user/profile${fetchString}`, {
					method: 'GET',
					credentials: "include",
				}));
				if (response.ok) {
					const data = await response.json();
					const userProfileNode = document.querySelector("#userpage-profile")

					userProfileNode.querySelector("#userpage-profile-nickname").innerText = data.nickname;
					userProfileNode.querySelector("#userpage-profile-idtag").innerText = "#" + data.id_tag;
					userProfileNode.querySelector("#userpage-profile-message").innerText = data.message;
					if (data.avatar)
						userProfileNode.querySelector("#userpage-profile-avatar").src = data.avatar;
					LogSetting();
					progressSetting();
				}
				else
					throw new Error(response.statusText);
			} catch (error) {
				const profileNode = document.querySelector("#app .container-fluid")
				profileNode.replaceChildren();
				profileNode.insertAdjacentHTML("beforeend", `
				<div class="d-flex justify-content-center align-items-center" style="min-height: 80dvh;">
					<div>유저가 존재하지 않습니다.</div>
				</div>
				`);
			}
		}

		const LogSetting = () => {
			const radioBtn = document.querySelector("#log-btn-group");
			const logPannel = document.querySelector("#log-pannel");
			const logSetting1vs1 = () => {
				logPannel.replaceChildren();
				const pannelNode = document.createElement("li");
				pannelNode.setAttribute("class", "d-flex align-items-center border");
				pannelNode.insertAdjacentHTML("beforeend", `
				<div class="align-self-stretch bg-primary text-white p-2">
					승
				</div>
				<div class="d-inline-flex justify-content-around align-items-center p-2" style="width: 40rem;">
					<div>
						<span>nick1</span>
						<span class="text-secondary">#1234</span>
					</div>
					<div class="mx-2">
						12 : 3
					</div>
					<div>
						<span>nick2</span>
						<span class="text-secondary">#abcd</span>
					</div>
				</div>
				<div class="ms-auto p-2 text-end">
					<div>2024:04:02 18:49</div>
					<div><b>Hard</b></div>
				</div>
				`);
				logPannel.appendChild(pannelNode);
			}
			const logSetting2vs2 = () => {
				logPannel.replaceChildren();
			}
			const logSettingTournament = () => {
				logPannel.replaceChildren();
			}
			
			logSetting1vs1();
			radioBtn.querySelector("#btnradio1").addEventListener("change", e => {
				if (e.currentTarget.checked) {
					console.log("1 vs 1");
					logSetting1vs1();
				}
			})
			radioBtn.querySelector("#btnradio2").addEventListener("change", e => {
				if (e.currentTarget.checked) {
					console.log("2 vs 2");
					logSetting2vs2();
				}
			})
			radioBtn.querySelector("#btnradio3").addEventListener("change", e => {
				if (e.currentTarget.checked) {
					console.log("Tournament");
					logSettingTournament();
				}
			})
		}

		const progressSetting = () => {
			const progressBar = document.querySelector("#winrate-progress");
			const saveLog = localStorage.getItem("log");
			if (saveLog !== null) {
				const parsedLog = JSON.parse(saveLog);
				const winNum = parsedLog.win;
				const loseNum = parsedLog.lose;
				const winRate = Math.round((winNum / (winNum + loseNum)) * 100);
				const loseRate = 100 - winRate;

				const progressBarWin = progressBar.children[0];
				progressBarWin.setAttribute("aria-valuenow", `${winRate}`);
				progressBarWin.setAttribute("style", `width: ${winRate}%`);
				progressBarWin.children[0].innerText = `${winNum}`;
				const progressBarLose = progressBar.children[1];
				progressBarLose.setAttribute("aria-valuenow", `${loseRate}`);
				progressBarLose.setAttribute("style", `width: ${loseRate}%`);
				progressBarLose.children[0].innerText = `${loseNum}`;
				document.querySelector("#rate-progress").innerText = `${winRate}%`;
			}
		}

		profileSetting();
	}
}