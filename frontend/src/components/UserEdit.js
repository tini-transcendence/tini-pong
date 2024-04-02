import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js";
import DefenseXss from "../utils/defenseXss.js";

const fileForm = /image\/(jpg|jpeg|png|gif)$/;
const maxFileSize = 2 * 1024 * 1024;

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("UserEdit");
	}

	async getHtml(loginModule) {
		loginModule.isLogin();
		return `
		<div class="container">
			<h3 class="m-3 text-center">
				UserEdit
			</h3>
			<div class="mb-3">
				<label for="nickname-form" class="form-label">Nickname</label>
				<input type="text" class="form-control" id="nickname-form" minlength="2" maxlength="10" placeholder="Enter your nickname">
				<p class="text-danger" id="form-danger-1">&nbsp</p>
			</div>
			<div class="mb-3">
				<label for="avatar-form" class="form-label">Avatar Image</label>
				<div class="text-center mb-2">
					<img id="image-preview" src="./src/img/default_profile.png" width="200px" height="200px" alt="avatar thumbnail" style="border-radius: 20%;"/>
				</div>
				<input class="form-control" type="file" id="avatar-form" accept="image/*">
			</div>
			<div class="mb-3">
				<label for="message-form" class="form-label">Status message</label>
				<input type="text" class="form-control" id="message-form" maxlength="100" placeholder="Enter your status message">
			</div>
			<div class="text-center">
				<button class="btn btn-outline-primary btn-lg" id="editpage-submit">Submit</button>
			</div>
		</div>
		`;
	}

	handleRoute() {
		const defenseXss = new DefenseXss();
		let validNick = false;
		const nicknameForm = document.querySelector("#nickname-form");
		const avatarForm = document.querySelector("#avatar-form");
		const messageForm = document.querySelector("#message-form");

		nicknameForm.addEventListener("change", e => {
			if (e.target.value.length < 3) {
				document.querySelector("#form-danger-1").innerText = "닉네임은 최소 3글자 이상으로 구성되어야 합니다.";
				validNick = false;
			}
			else if (!defenseXss.validateNickname(e.target.value)) {
				document.querySelector("#form-danger-1").innerText = "닉네임은 한글과 알파벳, 숫자로만 구성될 수 있습니다.";
				validNick = false;
			}
			else {
				document.querySelector("#form-danger-1").innerText = "\u00A0";
				validNick = true;
			}
		})

		avatarForm.addEventListener("change", e => {
			const imgFile = e.target.files[0];
			if (!imgFile.type.match(fileForm)) {
				alert("이미지 파일(jpg, jpeg, png, gif)만 업로드!");
				return ;
			} else if (imgFile.size > maxFileSize) {
				alert("2MB 이하 크기만 업로드!");
				return ;
			}
			const imageUrl = URL.createObjectURL(imgFile);
			document.querySelector("#image-preview").setAttribute("src", `${imageUrl}`);
		})

		const editPageSubmit = document.querySelector("#editpage-submit");
		editPageSubmit.addEventListener("click", async e => {
			console.log(nicknameForm.value);
			console.log(avatarForm.src);
			console.log(defenseXss.replaceSpecial(messageForm.value));

			try {
				const fetchModule = new FetchModule();
				const response = await fetchModule.request(new Request("https://localhost:8000/user/edit"), {
					method: 'POST',
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						nickname: nicknameForm.value,
						avatar: avatarForm.src,
						message: defenseXss.replaceSpecial(messageForm.value),
					}),
				})
				if (response.ok) {
					console.log("저장되었습니다.");
				}
				else
					throw new Error(response.statusText);
			} catch (error) {
				console.log(error.message);
			}
		})
	}
}