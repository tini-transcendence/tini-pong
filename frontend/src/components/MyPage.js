import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("MyPage");
	}

	async getHtml(loginModule) {
		loginModule.isLogin();
		return `
		<div class="container-fluid">
			<div class="row row-cols-1 row-cols-md-2 m-md-3 mt-3">
				<div class="col col-md-4 p-2 border">
					<div class="text-center mb-3">
						<img class="img-fluid" src="./src/img/default_profile.png" width="200px" height="200px" alt="profile thumbnail" style="border-radius: 20%;"/>
					</div>
					<div class="text-center">
						<h3>Nickname</h3>
					</div>
					<div class="mx-2 border">
						<p>This is My Page.</p>
					</div>
				</div>
				<div class="col col-md-8 p-2 border">
					<h1>전적</h1>
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
					<ul class="mt-2 border overflow-auto" style="height: 500px; padding-left: 0;">
						<li class="d-flex align-items-center border">
							<div class="align-self-stretch bg-primary text-white p-2">
								승
							</div>
							<div class="d-inline-flex justify-content-around align-items-center p-2 border" style="width: 40rem;">
								<div>nick1</div>
								<div class="mx-2">
									12 : 3
								</div>
								<div>nick2</div>
							</div>
							<div class="ms-auto p-2">
								<div>2024:04:02 18:49</div>
								<div><b>Hard</b></div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		`;
	}

	handleRoute() {
		(function progressSetting() {
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
		})();
	}
}