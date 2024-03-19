import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("MyPage");
	}

	async getHtml() {
		return `
		<div class="row g-3">
			<div class="col">
				<h1>My Page</h1>
				<p>This is My Page.</p>
			</div>
			<div class="col">
				<h1>전적</h1>
				<div class="row">
					<div class="col">승률</div>
					<div class="col" style="text-align: right" id="rate-progress">25%</div>
				</div>
				<div class="progress-stacked" id="winrate-progress">
					<div class="progress" role="progressbar" aria-label="Segment-win" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="width: 15%">
						<div class="progress-bar progress-bar-striped progress-bar-animated">15</div>
					</div>
					<div class="progress" role="progressbar" aria-label="Segment-lose" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
						<div class="progress-bar progress-bar-striped progress-bar-animated bg-danger">85</div>
					</div>
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