import "../node_modules/bootstrap/dist/js/bootstrap.js"

import Navbar from "./components/Navbar.js";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Oauth from "./components/Oauth.js";
import OtpQR from "./components/OtpQR.js";
import Otp from "./components/Otp.js";
import UserPage from "./components/UserPage.js";
import UserEdit from "./components/UserEdit.js";
import Lobby from "./components/Lobby.js";
import Local from "./components/Local.js";
import Tdata from "./components/tournamentData.js";
import Room from "./components/Room.js";
import NotFound from "./components/NotFound.js";

import LoginModule from "./utils/loginmodule.js";
import animateGame from "./utils/animateGameModule.js";

const ROUTE_PARAMETER_REGEX = /:(\w+)/g;
const URL_FRAGMENT_REGEX = /\//g;

const routes = [
	{ path: "/", component: [Main, Navbar]},
	{ path: "/login", component: [Login]},
	{ path: "/login/oauth", component: [Oauth]},
	{ path: "/login/otp/qr", component: [OtpQR]},
	{ path: "/login/otp", component: [Otp]},
	{ path: "/mypage", component: [UserPage, Navbar]},
	{ path: "/users/:useruuid", component: [UserPage, Navbar]},
	{ path: "/edit", component: [UserEdit]},
	{ path: "/lobby", component: [Lobby, Navbar]},
	{ path: "/local", component: [Local]},
	{ path: "/tdata", component: [Tdata]},
	{ path: "/room/:roomuuid", component: [Room]},
	{ path: "/404", component: [NotFound]},
];

const router = async () => {
	animateGame.setAnimateOff();

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			result: location.pathname.match(pathToRegex(route.path)),
		};
	});

	const getParams = (match) => {
		if (!match.result)
			return;
		const values = match.result.slice(1);
		const keys = Array.from(match.route.path.matchAll(ROUTE_PARAMETER_REGEX)).map(
			(result) => result[1]
		);
		return Object.fromEntries(
			keys.map((key, i) => {
				return [key, values[i]];
			})
		);
	}

	let match = potentialMatches.find(potentialMatches => potentialMatches.result);
	if (!match) {
		match = {
			route: routes[routes.length - 1],
			result: undefined
		}
	}

	const component = new match.route.component[0]();
	document.querySelector("#app").innerHTML = await component.getHtml(loginModule);
	if (match.route.component[1]) {
		const navbar = new match.route.component[1]();
		if (navbar) {
			document.querySelector("#nav").innerHTML = await navbar.getHtml();
			navbar.handleRoute();
		}
	}
	else {
		document.querySelector("#nav").innerHTML = await ``;
	}
	component.handleRoute(getParams(match));
}

const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const pathToRegex = (path) => {
	return new RegExp('^' + path.replace(URL_FRAGMENT_REGEX, '\\/').replace(ROUTE_PARAMETER_REGEX, '(.+)') + '$');
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.dataset.href) {
			e.preventDefault();
			navigateTo(e.target.dataset.href);
		}
	});
});

const loginModule = new LoginModule();

router();