export default class {
	constructor () {}

	validateNickname(value) {
		const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/;

		if (!regex.test(value))
			return false;
		return true;
	}

	replaceSpecial(value) {
		value = value.replaceAll("&", "&amp;");
		value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        value = value.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
        value = value.replaceAll("/", "&#x2F;");
        value = value.replaceAll("'", "&#x27;");
        value = value.replaceAll("\"", "&quot;");
	}
}