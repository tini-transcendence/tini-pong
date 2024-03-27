import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("GameRoom");
	}

	async getHtml() {
		return `
		<div class="container-fluid text-center">
			<div class="row">
				<div class="col-7 border p-2">
					<div class="row row-cols-1 row-cols-md-2 g-4">
						<div class="col">
							<div class="card h-100 w-75 m-auto" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready</div>
							</div>
						</div>
						<div class="col">
							<div class="card h-100 w-75 m-auto" style="max-width: 18rem;">
								<img src="/src/img/default_profile.png" class="card-img-top" alt="profile">
								<div class="card-body">
									<h5 class="card-title">Nickname</h5>
									<p class="card-text">Win:0 Lose:0</p>
								</div>
								<div class="card-footer">Ready</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-5 border">
					정보 영역
				</div>
			</div>
		</div>
		`;
	}

	handleRoute() {
	}
}