import AbstractComponent from "./AbstractComponent.js";

const fileForm = /image\/(jpg|jpeg|png|gif)$/;
const maxFileSize = 2 * 1024 * 1024;

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("UserEdit");
	}

	async getHtml() {
		return `
		<div class="justify-content-center" id="image-preview">
		</div>
		<div class="mb-3">
			<label for="formFile" class="form-label">Profile Image</label>
			<!-- <input class="form-control" type="file" id="formFile" accept="image/*"> -->
			<input class="form-control" type="file" id="formFile">
		</div>
		`;
	}

	handleRoute() {
		const uploadImage = document.querySelector("#formFile");
		uploadImage.addEventListener("change", e => {
			console.log("file upload!");
			const imgFile = e.target.files[0];
			console.log(imgFile);
			console.log(e.target);
			if (!imgFile.type.match(fileForm)) {
				alert("이미지 파일만 업로드!");
				return ;
			} else if (imgFile.size > maxFileSize) {
				alert("2MB 이하 크기만 업로드!");
				return ;
			}
			const imageUrl = URL.createObjectURL(imgFile);
			document.querySelector("#image-preview").insertAdjacentHTML("beforeend", `
			<img src="${imageUrl}" width="200px" height="200px" alt="profile thumbnail" style="border-radius: 30%;"/>
			`);

			// const reader = new FileReader();
			// reader.onload = e => {
			// 	console.log(e.target.result);
			// 	document.querySelector("#image-preview").insertAdjacentHTML("beforeend", `
			// 	<img src="${e.target.result}" width="200px" height="200px"/>
			// 	`);
			// }
			// reader.readAsDataURL(e.target.files[0]);
		})
	}
}