import AbstractComponent from "./AbstractComponent.js";

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
		<div class="justify-content-center">
			<img id="image-preview" src="./src/img/default_profile.png" width="200px" height="200px" alt="profile thumbnail" style="border-radius: 20%;"/>
		</div>
		<div class="mb-3">
			<label for="profile-form" class="form-label">Profile Image</label>
			<input class="form-control" type="file" id="profile-form" accept="image/*">
		</div>
		<div class="mb-3">
			<label for="message-form" class="form-label">Status message</label>
			<input type="text" class="form-control" id="message-form" placeholder="Enter your status message">
		</div>
		<div>
			<button class="btn btn-outline-primary btn-lg" id="editpage-submit">Submit</button>
		</div>
		`;
	}

	handleRoute() {
		const uploadImage = document.querySelector("#profile-form");
		uploadImage.addEventListener("change", e => {
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
		editPageSubmit.addEventListener("click", e => {
			console.log(document.querySelector("#image-preview").src);
			console.log(document.querySelector("#message-form").value);
		})
	}
}